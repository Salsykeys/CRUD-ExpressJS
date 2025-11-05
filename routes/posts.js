const express = require("express");
const router = express.Router();

const connections = require("../config/database");
const { body, validationResult } = require("express-validator");

router.get("/", (req, res) => {connections.query("SELECT * FROM posts ORDER BY id desc", (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "List Data Posts",
        data: rows,
      });
    }
  });
});

router.post(
  "/store",
  [
    // Validation
    body("title").notEmpty(),
    body("content").notEmpty(),
  ],
    (req, res) => {const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    // define formData
    let formData = {
      title: req.body.title,
      content: req.body.content,
    };

    connections.query("INSERT INTO posts SET ?", formData, (err, rows) => {
      console.log("MYSQL ERROR : ", err);

      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "Insert Data Successfully",
          data: rows[0],
        });
      }
    });
});

router.get("/:id", (req, res) => {
  let id = req.params.id;

  connections.query(`SELECT * FROM posts WHERE id = ${id}`, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }

    // file not found
    if (rows.length <= 0) {
      return res.status(404).json({
        status: false,
        message: "Data Post Not Found",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Detail Data Post",
        data: rows[0],
      });
    }
  });
});

router.patch("/update/:id",[
    // Validation
    body("title").notEmpty(),
    body("content").notEmpty(),
  ],(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    // id post
    let id = req.params.id;

    // data post
    let formData = {
      title: req.body.title,
      content: req.body.content,
    };

    // update query
    connections.query(`UPDATE posts SET ? WHERE id = ${id}`,formData,(err, rows) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Update Data Successfully",
          });
        }
    });
});

/**
 * Delete Post
 */

router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;

    connections.query(`DELETE FROM posts WHERE id = ${id}`, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error'
            })
        }else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully'
            })
        }
    })
})

module.exports = router;
