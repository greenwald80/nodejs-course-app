const {Schema,model} = require('mongoose');

const courseSchema = new Schema({
  title:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  img:String,
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User'
  }
});

courseSchema.method('toClient',function(){
  const course = this.toObject();//чтобы получить объект данного курса
  course.id = course._id;
  delete course._id;//удалить лишнюю информацию
  return course;
  
})

module.exports=model('Course',courseSchema);