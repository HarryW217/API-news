const db = require("../db/connection");

exports.deleteCommentById = (comment_id) => {
    return db
        .query(`
            DELETE FROM comments
            WHERE comment_id=$1
        `, [comment_id]
    ).then((response) => {
        if (response.rowCount === 0) {
            return Promise.reject({
                status: 404,
                msg: "Comment does not exist"
            })
        }
    })
}