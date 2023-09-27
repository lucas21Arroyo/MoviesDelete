const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment')

const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    add: function (req, res) {
        
        return res.render('moviesAdd')  
    },
    create: function (req, res) {
        const {title,rating,release_date, awards,length,genre_id} = req.body

        db.Movie.create({
            title : title.trim(),
            rating , 
            awards ,
            release_date,
            length,
            genre_id
        })

        .then(movie =>{
            console.log(movie);
            return res.redirect('/movies')
        })
        
    },
    edit: function(req, res) {
        db.Movie.findByPk(req.params.id)
            .then(movie=>{
                console.log(moment(movie.release_date).format('YYYY-MM-DD'));
                return res.render('moviesEdit',{
                    Movie : movie,
                    moment
                })
                
            })
            .catch(error => console.log(error))
        
    },
    update: function (req,res) {
        const {title,rating,release_date, awards,length,genre_id} = req.body
        db.Movie.update({
            title : title.trim(),
            rating , 
            awards ,
            release_date,
            length,
            genre_id
        },
            {
                where : {
                    id : req.params.id
                }
            })
            .then(response => {
                console.log(response);
                db.Movie.findByPk(req.params.id)
                .then(movie =>{
                    return res.render('moviesDetail',{
                        movie
                    })
                })
               

            })
            .catch(error => console.log(error))
         
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(movie=>{
                return res.render('moviesDelete',{
                    Movie : movie
                    
                })
                
            })
            .catch(error => console.log(error))
        
    
    },
    destroy: function (req, res) {
        db.Movie.findByPk(req.params.id)
          .then(movie=>{
            deleteMovie = movie.title

            return db.Movie.destroy({
                where : {id : req.params.id}
                
            })
            .then(movie =>{
                console.log(`la pelicula ${deleteMovie} fue eliminada con exito`);
                return res.redirect('/movies')
            })

            .catch(error => console.log(error))
          })


        
        

    }

}

module.exports = moviesController;