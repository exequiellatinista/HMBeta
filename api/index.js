const axios = require('axios')
const Cookies = require('cookies')
// const app = require('express')()
const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
module.exports = { path: '/api', handler: app }


const getToken = (req, res) => {
  const cookies = new Cookies(req, res)
  const token = cookies.get('token')
  return token
}

const getUser = (req, res) => {
  const cookies = new Cookies(req, res)
  const user = JSON.parse(cookies.get('user'))
  return user
}

const deleteToken = (req, res) => {
  const cookies = new Cookies(req, res)
  cookies.set('token', null, {
    maxAge: 1 * 1,
    httpOnly: true
  })
  cookies.set('user', null, {
    maxAge: 1 * 1,
    httpOnly: true
  })
}


app.get('/', (req, res) => {


  res.statusCode = 200
  res.json(getToken(req, res))
})
app.post('/client/login', (req, res) => {
  const post = {
    "username": req.body.username,
    "password": req.body.password
  }

  axios.post('https://happymatch.herokuapp.com/api/client/login', post)
    .then(response => {
      const { token, id, username, locals } = response.data
      const cookies = new Cookies(req, res)
      if (token) {

        cookies.set('token', 'Bearer ' + token, {
          maxAge: 3600000 * 12,
          httpOnly: true
        })

        cookies.set('user', JSON.stringify({ id, username, locals }), {
          maxAge: 3600000 * 12,
          httpOnly: true
        })


        res.json({
          data: response.data
        })

      }
    })
    .catch(e => {
      res.statusCode = 400
      res.json({
        error: e.message
      })
    })
})
app.get('/getAllClients', (req,res) => {
  const page = 1
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://happymatch.herokuapp.com/api/client/getAllClients/page/${page}`, get)
  .then(
    response => {
      res.json(response.data)
    }
  )
  .catch(e => {
    res.statusCode = e.response.status
    res.json({
      error: e.message
    })
  })
})
app.post('/createNewClient', (req,res) => {
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = {
      username: body.username,
      emailAddress: body.emailAddress,
      password: body.password,
  }

  axios.post('https://happymatch.herokuapp.com/api/client/create', data,  headers)
  .then(
    response => {
      res.json(response.data)
    }
  )
  .catch(e => {
    console.log(e.response.data)
    res.statusCode = e.response.status
    res.json({
      error: e.response.data
    })
  })
})
app.put('/updateClient/:clientID', (req,res) => {
  const { clientID } = req.params
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = {
      username: body.username,
      emailAddress: body.emailAddress,
      password: body.password,
  }

  axios.put(`https://happymatch.herokuapp.com/api/client/update/${clientID}`, data,  headers)
  .then(
    response => {
      res.json(response.data)
    }
  )
  .catch(e => {
    res.statusCode = e.response.status
    res.json({
      error: e.response.data
    })
  })
})
app.delete('/deleteClient/:clientID', (req,res) => {
  const { clientID } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  axios.delete(`https://happymatch.herokuapp.com/api/client/delete/${clientID}`,  headers)
  .then(
    response => {
      res.json(response.data)
    }
  )
  .catch(e => {
    res.statusCode = e.response.status
    res.json({
      error: e.response.data
    })
  })
})
app.post('/admin/login', (req, res) => {
  const post = {
    "username": req.body.username,
    "password": req.body.password
  }

  axios.post('https://happymatch.herokuapp.com/api/admin/login', post)
    .then(response => {
      const { token, id, username } = response.data
      const cookies = new Cookies(req, res)
      if (token) {

        cookies.set('token', 'Bearer ' + token, {
          maxAge: 3600000 * 12,
          httpOnly: true
        })

        cookies.set('user', JSON.stringify({ id, username }), {
          maxAge: 3600000 * 12,
          httpOnly: true
        })


        res.json({
          data: response.data
        })

      }
    })
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.message
      })
    })
})
app.get('/getGroupTables/:localId', (req, res) => {
  const { localId } = req.params
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://happymatch.herokuapp.com/api/groupTables/getAllGroupTablesByLocalId/${localId}`, get)
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.message
      })
    })
})

app.get('/getUser', (req, res) => {
  const user = getUser(req, res)
  res.json(user)
})

app.get('/getQuestions/:localId', (req, res) => {
  const { localId } = req.params
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://happymatch.herokuapp.com/api/questions/getQuestionsByLocalId/${localId}`, get)
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.message
      })
    })
})

app.post('/createQuestions', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { Authorization: token }
  }
  const data = {
    data: {
      localId: body.localId,
      arrayQuestions: body.questions
    }
  }
  axios.post('https://happymatch.herokuapp.com/api/questions/create', headers, data)
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.message
      })
    })
})

app.post('/updateQuestions', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const localId = body.localId

  console.log('localID: ', localId)
  console.log('token: ', token)

  const data = {
    arrayQuestions: body.questions
  }

  axios.put(`https://happymatch.herokuapp.com/api/questions/update/${localId}`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    }
  })
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      console.log('error servidor', e)
      res.json({
        error: e.message
      })
    })
})

app.post('/banGroupTable/:idGroup', (req, res) => {
  const { idGroup } = req.params
  const body = req.body
  const token = getToken(req, res)
  const data = {
    reason: body.reason
  }
  console.log('idGroup: ', idGroup, ' Token: ', token)
  axios.post(`https://happymatch.herokuapp.com/api/groupBans/${idGroup}`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    }
  }).then(response => {
    res.json(response.data)
  })
    .catch(e => {
      res.statusCode = e.response.status
      console.log('error servidor', e)
      res.json({
        error: e.message
      })
    })
})

app.delete('/unBanGroupTable/:idGroup', (req, res) => {
  const { idGroup } = req.params

  const token = getToken(req, res)

  axios.post(`https://happymatch.herokuapp.com/api/groupBans/unban/${idGroup}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    }
  }).then(response => {
    res.json(response.data)
  })
    .catch(e => {
      res.statusCode = e.response.status
      console.log('error servidor', e)
      res.json({
        error: e.message
      })
    })
})

app.get('/getGroupsBan', (req, res) => {
  console.log('entro api')
  const token = getToken(req, res)
  const user = getUser(req, res)
  const { id } = user
  console.log('idUser: ', id)


  axios.get(`https://happymatch.herokuapp.com/api/getgroupsbanbyclientid/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    }
  }).then(response => {
    res.json(response.data)
  })
    .catch(e => {
      res.statusCode = e.response.status
      console.log('error servidor', e)
      res.json({
        error: e.message
      })
    })
})

app.delete('/clearSesion', (req, res) => {
  try {
    deleteToken(req, res)
    res.end('Token deleted')
  }
  catch (error) {
    res.end(error)
  }
})
