const express = require ('express');
const app = express();
app.use('/static' , express.static('public'));
app.use(express.urlencoded({ extended: true}));
//USING ENV
const dotenv = require('dotenv');
dotenv.config();
//VIEW ENGINE
app.set("view engine" , "ejs");
//DB CONNECTION
const mongoose = require("mongoose");
//models
const TodoTask = require('./models/TodoTask');
//connection to db
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DATABASE , 
    { useNewUrlParser: true,useCreateIndex: true , useUnifiedTopology: true })
    .then(() => console.log("db connected!"))
    .catch((err) => console.log(err));


// GET METHOD EDIT 
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
});


//POST METHOD
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
        }
    });

    //UPDATE
    //First we find our id and we render the new template. Then we update our task using the method findByIdAndUpdate.
app
    .route("/edit/:id")
        .get((req, res) => {
             const id = req.params.id;
            TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
            const id = req.params.id;
            TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

//DELETE
        app.route("/remove/:id").get((req, res) => {
            const id = req.params.id;
            TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });
//PORT LISTENING 
app.listen(3000, () => console.log("we are listening to you ROBOT 3000"));