import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from './helper'

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
const postAndCommit = async (url: string, mutationName: string, payload: any, commit: Commit) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}
export interface ResponseType<P={}>{
  code: number;
  msg: string;
  data: P;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps|string;
  createdAt?: string;
  column: string;
  author?: UserProps|string;
  isHTML?: boolean;
}
interface GlobalPosts{
  data: ListProps<PostProps>;
  loadedColumns: string[];
}
interface GlobalList{
  data: ListProps<ColumnProps>;
  isLoaded: boolean;
  total: number;
}
interface ListProps<P>{
  [id: string]: P;
}
export interface GlobalErrorProps{
  status: boolean;
  message?: string;
}
export interface GlobalDataProps{
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: GlobalList;
  posts: GlobalPosts;
  user: UserProps;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, isLoaded: false, total: 0 },
    posts: { data: {}, loadedColumns: [] },
    user: { isLogin: false }
  },
  mutations: {
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        isLoaded: true
      }
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
      state.posts.loadedColumns.push(columnId)
    },
    fetchPost (state, { data }) {
      state.posts.data[data._id] = data
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    fetchCurrentUser (state, rawData) {
      state.user = {
        isLogin: true,
        ...rawData.data
      }
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout (state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    fetchColumns ({ state, commit }, params) {
      const { currentPage = 1, pageSize = 6 } = params
      // if (!state.columns.isLoaded) {
      return getAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      // }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts ({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
      }
    },
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    fetchCurrentUser ({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    login ({ commit }, payload) {
      return postAndCommit('/user/login', 'login', payload, commit)
    },
    createPost ({ commit }, payload) {
      return postAndCommit('/posts', 'createPost', payload, commit)
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumn: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(c => c.column === cid)
    },
    getCurrentPost: (state) => (pid: string) => {
      return state.posts.data[pid]
    }
  }
})

export default store
