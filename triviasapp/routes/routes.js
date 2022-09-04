const { Router } = require('express')
const { get_questions, create_question, compare_answer } = require('../db/questions.js');
const { get_games, create_game } = require('../db/games.js');

const router = Router()

let quantityQuestions = 0;

// Vamos a crear un middleware para ver si el usuario está logueado o no
function protected_route(req, res, next) {
  if (!req.session.user) {
    req.flash('errors', 'Debe loguearse primero')
    return res.redirect('/login')
  }
  // si llegamos hasta acá, guardamos el usuario de la sesión en una variable de los templates
  res.locals.user = req.session.user;
  // finalmente, seguimos el camino original
  next()
}

function protected_route_admin(req, res, next) {
  if (!req.session.user.is_admin) {
    req.flash('errors', 'Usted no es administrador');
    return res.redirect('/');
  }
  res.locals.user = req.session.user;
  next();
}


router.get('/', protected_route, async (req, res) => {
  const games = await get_games();
  const messages = req.flash();
  res.render('index.html', { games, messages });
})

router.get('/new_question', protected_route_admin, (req, res) => {
  const messages = req.flash()
  res.render('question.html', { messages });
})

router.post('/new_question', protected_route_admin, async (req, res) => {
  if (!/([^\s]{3,})/g.test(req.body.question.trim())|| 
  !/([^\s]{3,})/g.test(req.body.correctAnswer.trim()) || 
  !/([^\s]{3,})/g.test(req.body.incorrectAnswer1.trim())|| 
  !/([^\s]{3,})/g.test(req.body.incorrectAnswer2.trim())) {
    req.flash('errors', `Está ingresando una cadena de texto vacía...`)
    return res.redirect('/new_question');
  } else {
    const question = {
      question: req.body.question.trim(),
      correctAnswer: req.body.correctAnswer.trim(),
      incorrectAnswer1: req.body.incorrectAnswer1.trim(),
      incorrectAnswer2: req.body.incorrectAnswer2.trim(),
      incorrectAnswer3: req.body.incorrectAnswer3.trim(),
      incorrectAnswer4: req.body.incorrectAnswer4.trim()
    }
    try {
      await create_question(question);
      req.flash('success', `¡Pregunta agregada satisfactoriamente!`)
      res.redirect('/new_question');
    } catch (error) {
      console.log('Error al crear la pregunta: ' + error);
    }
  }
})

router.get('/lets_play', protected_route, async (req, res) => {
  let questions = await get_questions(quantityQuestions);
  res.render('play.html', { questions });
})

router.post('/quantity_questions', protected_route, (req, res) => {
  quantityQuestions = parseInt(req.body.quantityQuestions.trim());
  res.redirect('/lets_play');
})

router.post('/lets_play', protected_route, async (req, res) => {
  let score = 0;
  let percentage = 0;
  const userId = parseInt(req.body.userId.trim());
  for (let i = 1; i <= quantityQuestions; i++) {
    let answer = req.body[`question${i}`].trim();
    (await compare_answer(answer) ? score++ : score = score);
  }
  percentage = (score / quantityQuestions * 100).toFixed(2);
  (quantityQuestions < 3) ? score = score + '/3' : score = score + '/' + quantityQuestions;
  try {
    let game = {
      score: score,
      percentage: percentage,
      userId, userId
    }
    await create_game(game);
    let message;
    if (percentage < 34) {
      message = '¡Oh, lo sentimos!, suerte para la próxima\n Tu puntaje fue de: ' + score + ' y en porcentaje fue de: ' + percentage + '%';
    }
    if (percentage > 34) {
      message = '¡Muy buen intento! \n Tu puntaje fue de: ' + score + ' y en porcentaje fue de: ' + percentage + '%';
    }
    if (percentage == 100) {
      message = '¡Felicitaciones!, \nTu puntaje fue de: ' + score + ' y en porcentaje fue de: ' + percentage + '%';
    }
    req.flash('info', message);
    res.redirect('/');
  } catch (error) {
    console.log('Error al guardar el juego: ' + error);
  }
})

router.get('*', (req, res) => {
  res.render('errors/404.html')
})

module.exports = router;