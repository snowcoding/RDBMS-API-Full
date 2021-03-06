const express = require('express');

const db = require('../db');

const post = express.Router();

post.get('/', (req,res) => {
  db('posts')
    .then( post => {
      res.status(200).json(post)
    })
    .catch(err => res.status(500).json(err))
})

post.get('/:id', (req,res) => {
  const id = req.params.id

  db('posts')
    .where({id})
      .then( post => {
        if (post.length > 0){
          res.status(200).json(post)
        }else{
          res.status(400).json({err: 'That post ID was not found'})
        }
        
      })
      .catch(err => res.status(500).json(err))
})

post.put('/:id', (req,res) => {
  const id = req.params.id
  const body= req.body

  db('posts')
    .where({id})
    .update(body)
      .then( post => {
        console.log(post)
        if (post === 1){
          res.status(200).json(`message: ${post} post record updated`)
        }
        else {
          res.status(400).json(`message: the post id was not found`)
        }
      })
      .catch(err => res.status(500).json(err))
})

post.get('/:id/tags', (req,res) => {
  const {id} = req.params

  db('posts')
  .where({id})
    .then( post => {
      if (post.length > 0){
        
        db('posts_tags_map').select('tags_id').where({'posts_id':id})
        .then( data =>{
          res.status(200).json(data)
        })
      }else{
        res.status(400).json({err: 'That post ID was not found'})
      }
      
    })
    .catch(err => res.status(500).json(err))
})


post.post('/', (req,res) => {
  const post = req.body

  db.insert(post)
    .into('posts')
    .then( data => {
      if (data.length === 1){
        res.status(201).json({message: `1 post added with ID = ${data[0]}`})
      }
    })
    .catch(err => res.status(500).json(err))
})

post.delete('/:id', (req,res) => {
  const id = req.params.id

  db('posts')
    .where({id})
    .del()
    .then( data => {
      if (data === 1){
        res.status(201).json({message: `1 post deleted`})
      }else {
        res.status(400).json({message: 'post with that ID not found'})
      }
    })
    .catch(err => res.status(500).json(err))
})

module.exports = post