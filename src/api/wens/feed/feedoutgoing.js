import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-feed/feedoutgoing/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-feed/feedoutgoing/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-feed/feedoutgoing/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-feed/feedoutgoing/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-feed/feedoutgoing/submit',
    method: 'post',
    data: row
  })
}

export const updatestatus = (row) => {
  return request({
    url: '/api/blade-feed/feedoutgoing/updatestatus',
    method: 'post',
    data: row
  })
}