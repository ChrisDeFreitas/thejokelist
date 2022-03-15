/*
  JokeListApi.js
  by Chris DeFreitas
 
*/
'use strict'
     
const db = require('./db.js');


class JokeListApi {

  selectCols = 'id, title, body, category, score'
  maxrows = 0
  firstid = 0
  lastid = 0

  constructor(){}

  async init( storageName ){    //init db
    await db.init( storageName, false, true )
    
    this.maxrows = await db.count( 'joke' )
    console.log('jokelist.sqlite maxrows:', this.maxrows)
    
    let list = await db.query( 'Select id from joke order by id asc limit 1' )
    this.firstid = list[0].id
    console.log('jokelist.sqlite firstid:', this.firstid)
    
    list = await db.query( 'Select id from joke order by id desc limit 1' )
    this.lastid = list[0].id 
    console.log('jokelist.sqlite lastid:', this.lastid)
  }
  maxRows(){
    return this.maxrows
  }
  async prior( id = null ){
    if( !db.inited() ) 
      throw new Error(`JokeListApi.prior() error, database is not initialized.`)

    let sql = `Select ${this.selectCols} from joke `
    if( id !== null){
      let num = Number( id )
      if( isNaN( num ))
        throw new Error(`JokeListApi.prior() error, id is not a number:[${id}]`)
      if( num <= this.firstid ) num = this.lastid
      else num--
      sql +=`Where id <= ${num} `
    }
    sql += 'Order by id desc Limit 1'
    console.log('sql', sql)
    let rows = await db.query( sql )
    if( rows.length  === 0)
      return null
    return rows[0]
  }
  async next( id = null ){
    if( !db.inited() ) 
      throw new Error(`JokeListApi.next() error, database is not initialized.`)

    let sql = `Select ${this.selectCols} from joke `

    if( id !== null){   // filter records
      let num = Number( id )
      if( isNaN( num ))
        throw new Error(`JokeListApi.next() error, id is not a number:[${id}]`)
      if( num >= this.lastid ) num = this.firstid
      else num++
      sql +=`Where id >= ${num} `
    }

    sql += 'Order by id Limit 1'
    // console.log('sql', sql)

    let rows = await db.query( sql )
    if( rows.length  === 0)
      return null
    return rows[0]
  }
  async random(){   // return random joke
    if( !db.inited() ) 
      throw new Error(`JokeListApi.random() error, database is not initialized.`)

    const crypto = require("crypto")
    let num = crypto.randomInt( 1, (this.maxrows +1 ))
    let sql = `
Select * from (
  Select ${this.selectCols}, row_number() over (order by id) as rownum
  from joke
)
where rownum = ${num}
    `.trim()
    let rows = await db.query( sql )
    if( rows.length  === 0)
      return null
    return rows[0]
  }
  async find( txt ){
    const { Op } = require("sequelize")
    let rows = await db.rowFindAll( 'joke', {
      attributes:[ 'id', 'title', 'body', 'category', 'score' ],
      where:{ body:{ [Op.substring]:txt }}
    })
    return rows
  }

}
  
exports.api = new JokeListApi()
