const { Router } = require('express')
const bcrypt = require('bcrypt')
const { get_user, create_user } = require('../db/users.js')

const router = Router()

// ruta que carga el formulario del login
router.get('/login', (req, res) => {
  const messages = req.flash()
  res.render('auth/login.html', { messages })
})

// ruta que procesa el formulario de Login
router.post('/login', async (req, res) => {
  // 1. me traigo los datos del formulario
  const email = req.body.email.trim()
  const password = req.body.password.trim()
  if (!/([^\s]{3,})/g.test(email) || !/([^\s]{3,})/g.test(password)){
    req.flash('errors', 'Está ingresando una cadena de texto vacía o espacios en blanco');
    return res.redirect('/login');
  }

  // 2. intento buscar al usuario en base a su email 
  let user_buscado = await get_user(email)
  if (!user_buscado) {
    req.flash('errors', 'Las credenciales no coinciden con nuestros registros')
    return res.redirect('/login')
  }

  // 3. verificamos las contraseñas
  const son_coincidentes = await bcrypt.compare(password, user_buscado.password)
  if (!son_coincidentes) {
    req.flash('errors', 'Las credenciales no coinciden con nuestros registros')
    return res.redirect('/login')
  }
  
  // PARTE FINAL
  req.session.user = {
    name: user_buscado.name,
    email: user_buscado.email,
    is_admin: user_buscado.is_admin,
    id: user_buscado.id
  }
  return res.redirect('/')  
})

router.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/login')
})

router.get('/register', (req, res) => {
  const messages = req.flash()
  res.render('auth/register.html', {messages})
})

router.post('/register', async (req, res) => {
  // 1. me traigo los datos del formulario
  const name = req.body.name.trim()
  const email = req.body.email.trim()
  const password = req.body.password.trim()
  const password_repeat = req.body.password_repeat.trim()

  if (!/([^\s]{3,})/g.test(name) || !/([^\s]{3,})/g.test(email) || !/([^\s]{3,})/g.test(password) || !/([^\s]{3,})/g.test(password_repeat)){
    req.flash('errors', 'Está ingresando una cadena de texto vacía o espacios en blanco');
    return res.redirect('/register');
  }

  // 2. validamos que contraseñas coincidan
  if (password != password_repeat) {
    req.flash('errors_password', 'Las contraseñas no coinciden')
    return res.redirect('/register')
  }

  // 3. validamos que no exista otro usuario con ese mismo correo
  const current_user = await get_user(email)
  if (current_user) {
    req.flash('errors_email', 'El correo electrónico ya está ocupado')
    return res.redirect('/register')
  }

  // 4. Finalmente lo agregamos a la base de datos
  const encrypted_pass = await bcrypt.hash(password, 10)
  const new_user = await create_user(name, email, encrypted_pass)
  req.session.user = { id: new_user.id, name, email, is_admin: new_user.is_admin }

  // 5. y redirigimos a la ruta principal
  res.redirect('/')
})

module.exports = router;
