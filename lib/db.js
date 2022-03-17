/*  
  db.js
  by Chris DeFreitas
 
  - singleton interface to sequelize sqlite database
  - sinolify access to selected functionality: create, update, query, find...
  - schemas defined in sequelize.schema.js
  - indexes defined in sequelize.schema.js
  - row is a model Instance, result of model.create() etc  
    -- https://sequelize.org/v7/manual/model-instances.html
  - this.query()/find()/findAll() return: [ {}, ... ]

  references:
    https://sequelize.org/v7/manual/
    https://sequelize.org/v7/identifiers.html

*/


const { Sequelize } = require('sequelize')
const { indexes, schemas } = require('./sequelize.schema.js')

var sequelize = null

module.exports = { 
  debug: false,
  fullpath: '',
  // models: [], //populated by this.init()
  schemas:schemas,
  indexes:indexes,

  inited(){
    return sequelize !== null
  },
  getFullPath(){    // return path of sqlite file from server root: /
    return this.fullpath
  },

  async init( storageName, sequelizeLogging = false, debug = false ){
  
    if( this.inited() === true )
      return true
//      throw new Error(`db.init() error, already called; call close() first.`)

    if( storageName === null || storageName === '')
      throw new Error(`db.init() error, storeageName is null: [${storageName}].`)
  
    this.debug = debug
    if( debug ) console.log('db.init():', storageName)

    if( storageName === ':memory:')
      this.fullpath = ':memory:'
    else{
      const path = require('path');
      this.fullpath = path.resolve( storageName )
    }
    if( debug )  console.log('...fullpath:', this.fullpath)

    try {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: storageName,
        logging: sequelizeLogging
      })

      this.modelsMake()

      await sequelize.authenticate()
      if( debug ) console.log('...connection established.')

      await sequelize.sync({ alter:false, force:false })
      if( debug ) console.log("...models synchronized.")

      if( debug ) console.log('db.init() done.')
      return true
    }
    catch(error){
      console.error('db.init() error caught:', error)
      return false
    }

  },
  async close(){
    await sequelize.close()
    sequelize = null
    if( this.debug ) console.log( 'db.close() completed.' )
  },

  modelGet( name ){
    let model = sequelize.models[ name ]
     if(model === undefined) 
      throw new Error(`db.modelGet() error, unknown model requested: [${name}].`)
    return model
  },
  async modelsMake(){
    if( sequelize.models.length > 0 )
      throw new Error( `db.modelsMake() error, should not be called by user.`)

    for( let key in this.schemas ){
      await sequelize.define(     //populates: sequelize.models{}
        key, 
        this.schemas[key], 
        {  //options
          // raw: true,
          freezeTableName: true,
          indexes: this.indexes[key],
          tableName: key,
          timestamps: true,
        }
      )
    }
  },

  async rowCreate( modelName, dataObj ){    
    let model = ( typeof modelName === 'object' ?modelName :this.modelGet( modelName ) )
    return await model.create( dataObj )
  },
  async rowUpdate( row, dataObj ){ 
    await row.update( dataObj )
    return await row.save()
  },

  async count( modelName, options = null ){ // returns 
    // https://sequelize.org/v7/class/src/model.js~Model.html#static-method-count
    let model = ( typeof modelName === 'object' ?modelName :this.modelGet( modelName ) )
    if( options === null ) options = {}
    options.paranoid = true   // If true, only non-deleted records will be returned
    options.raw = true        // return {} not model
    return await model.count( options )
  },
  async query( sql ){   // select returns: [ {}, ... ]
    // https://sequelize.org/v7/manual/raw-queries.html
    const [list, statement] = await sequelize.query( sql ) 
    // statement is null for sqlite
    return list
  },
  async rowFind( modelName, wherObj ){ // returns {}
    // https://sequelize.org/v7/class/src/model.js~Model.html#static-method-findOne
    let model = ( typeof modelName === 'object' ?modelName :this.modelGet( modelName ) )
    let obj = ( wherObj['where'] !== undefined 
      ? wherObj
      : { where: wherObj }
    )
    obj.raw = true        // return {}
    return await model.findOne( obj )
  },
  async rowFindAll( modelName, wherObj ){   // select returns: [ {}, ... ]
    // https://sequelize.org/v7/class/src/model.js~Model.html#static-method-findAll
    let model = ( typeof modelName === 'object' ?modelName :this.modelGet( modelName ) )
    let obj = ( wherObj['where'] !== undefined 
      ? wherObj
      : { where: wherObj }
    )
    obj.paranoid = true   // If true, only non-deleted records will be returned
    obj.raw = true        // return [ {}, ... ]
    return await model.findAll( obj )
  },

  rowToConsole( row ){
    console.log( model.getTableName()+':\n', row.toJSON() )   //JSON.stringify( row, null, 3) 
  },
  schemaGet( name ){
    let schema = this.schemas[ name ]
     if(schema === undefined) 
      throw new Error(`db.schemaGet() error, unknown schema requested: [${name}].`)
    return schema
  },
  schemaJSON( name ){
    let schema = this.schemas[ name ]
     if(schema === undefined) 
      throw new Error(`db.schemaGet() error, unknown schema requested: [${name}].`)

    let obj = {}, keys = Object.keys( schema )
    keys.forEach( key => {
      obj[key] = ''
    })

    return JSON.stringify( obj )
  },
  schemaObjDef( name ){
    let schema = this.schemas[ name ]
     if(schema === undefined) 
      throw new Error(`db.schemaGet() error, unknown schema requested: [${name}].`)

    let obj = {}, keys = Object.keys( schema )
    keys.forEach( key => {
      obj[key] = {}
      // obj[key].name = key
      obj[key].type = schema[key].type.constructor.key
      if(schema[key].autoIncrement)
          obj[key].autoIncrement = schema[key].autoIncrement
      if(schema[key].primaryKey)
          obj[key].primaryKey = schema[key].primaryKey
      if(schema[key].allowNull)
        obj[key].allowNull = schema[key].allowNull
      if(schema[key].type._length)
        obj[key].length = schema[key].type._length
      if(schema[key].comment)
        obj[key].comment = schema[key].comment
    })

    return JSON.stringify( obj, null, 3 )
  }
}
