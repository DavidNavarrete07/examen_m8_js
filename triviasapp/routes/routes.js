const { Router } = require('express')
const { get_questions, create_question, compare_answer } = require('../db/questions.js');
const { get_games, create_game } = require('../db/games.js');

const router = Router()

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

function protected_route_admin(req, res, next){
  if(!req.session.user.is_admin){
    req.flash('errors', 'Usted no es administrador');
    return res.redirect('/');
  }
  res.locals.user = req.session.user;
  next();
}


router.get('/', protected_route, async(req, res) => {
  const games = await get_games();
  res.render('index.html', {games});
})

router.get('/new_question', protected_route_admin, (req, res) => {
  const messages = req.flash()
  res.render('question.html', { messages });
})

router.post('/new_question', protected_route_admin, async (req, res) => {
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
})

router.get('/lets_play', protected_route, async (req, res) => {
  const questions = await get_questions();
  res.render('play.html', { questions });
})

router.post('/lets_play', protected_route, async (req, res) => {
  let score = 0;
  let percentage = 0;
  const answerQuestion1 = req.body.question1.trim();
  const answerQuestion2 = req.body.question2.trim();
  const answerQuestion3 = req.body.question3.trim();
  const userId = parseInt(req.body.userId.trim());
  (await compare_answer(answerQuestion1) ? score++ : score = score);
  (await compare_answer(answerQuestion2) ? score++ : score = score);
  (await compare_answer(answerQuestion3) ? score++ : score = score);
  percentage = (score / 3 * 100).toFixed(2);
  score = score + '/3';
  try {
    let game = {
      score: score,
      percentage: percentage,
      userId, userId
    }
    await create_game(game);
    res.redirect('/');
  } catch (error) {
    console.log('Error al guardar el juego: ' + error);
  }
})

router.get('*', (req, res) => {
  res.render('errors/404.html')
})

module.exports = router;