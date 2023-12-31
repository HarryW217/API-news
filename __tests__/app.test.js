const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endPointsFile = require("../db/endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("GET:200 returns an array of all topic objects, each having a 'slug' and 'description' property, both containing string values", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic).toBe("object");
          expect(topic.hasOwnProperty("slug")).toBe(true);
          expect(topic.hasOwnProperty("description")).toBe(true);
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api", () => {
  test("GET:200 returns an object describing all available endpoints on API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endPointsResponse = response.body.endPoints;
        expect(endPointsResponse).toEqual(endPointsFile);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET:200 responds with an article object, which contains all the necessary properties", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body;
        const desiredArticle = {
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expect(article).toMatchObject(desiredArticle);
        expect(article.article_id).toBe(3);
      });
  });
  test("GET:404 returns error message when article does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found!");
      });
  });
  test("GET:400 returns error message when bad request (invalid ID) is made", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET:200 responds with an array of article objects in descending date order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articlesArr = response.body;
        expect(Array.isArray(articlesArr)).toBe(true);
        expect(articlesArr.length).toBe(13);
        articlesArr.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      });
  });
  test("GET:404 returns error message when given an invalid path", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST:201 inserts comment into the database and responds with the posted comment object", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Hello world",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const commentObj = response.body.comment;

        expect(commentObj.author).toBe(newComment.username);
        expect(commentObj.body).toBe(newComment.body);
        expect(commentObj.article_id).toBe(3);

        expect(typeof commentObj).toBe("object");
        expect(typeof commentObj.comment_id).toBe("number");
        expect(typeof commentObj.body).toBe("string");
        expect(typeof commentObj.author).toBe("string");
        expect(typeof commentObj.votes).toBe("number");
        expect(typeof commentObj.created_at).toBe("string");
      });
  });
  test("POST:400 responds with error message when body is missing required fields", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Missing required fields");
      });
  });
  test("POST:400 responds with error message when body contains invalid properties", () => {
    const newComment = {
      username: ["username"],
      body: 12345,
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  test("POST:400 responds with error message when article id does not exist", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Hello world",
    };
    return request(app)
      .post("/api/articles/99999/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  test("POST:400 responds with error message when article id is invalid", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Hello world",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 responds with an array of comment objects for the given article_id in descending date order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const commentsArr = response.body;
        const desiredArr = [
          {
            article_id: 3,
            author: "icellusedkars",
            body: "Ambidextrous marsupial",
            comment_id: 11,
            created_at: "2020-09-19T23:10:00.000Z",
            votes: 0,
          },
          {
            article_id: 3,
            author: "icellusedkars",
            body: "git push origin master",
            comment_id: 10,
            created_at: "2020-06-20T07:24:00.000Z",
            votes: 0,
          },
        ];
        expect(commentsArr).toEqual(desiredArr);
      });
  });
   test("GET:200 responds with an empty array of comment objects for an article's article_id if it has no comments", () => {
     return request(app)
       .get("/api/articles/4/comments")
       .expect(200)
       .then((response) => {
         const commentsArr = response.body;
         expect(commentsArr.length).toBe(0)
       });
   });
  test("GET:404 returns error message when article does not exist", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article comments not found!");
      });
  });
  test("GET:400 returns error message when bad request (invalid ID) is made", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE:204 deletes a comment by comment id and responds with a status 204 with no content", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("DELETE:404 returns an error when resource for deletion does not exist", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment does not exist");
      });
  });
  test("DELETE:400 returns an error when bad request (invalid id) is made", () => {
    return request(app)
      .delete("/api/comments/apples")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH:200 updates an article's vote property with a positive integer by article id, responding with the updated article", () => {
    const articleUpdatePositiveInt = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdatePositiveInt)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 1,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:200 updates an article's vote property with a negative integer by article id, responding with the updated article", () => {
    const articleUpdateNegativeInt = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdateNegativeInt)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: -5,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:400 returns error message when bad request (invalid ID) is made", () => {
    const articleUpdate = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/notAnId")
      .send(articleUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  test("PATCH:404 returns error message when article does not exist", () => {
    const articleUpdate = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/99999")
      .send(articleUpdate)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found!");
      });
  });
  test("PATCH:400 returns error message when request body is missing required fields", () => {
    const articleUpdate = { inc_votes: "Hello" };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  test("PATCH:400 returns error message when request body contains invalid data type", () => {
    const articleUpdate = {};
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Missing required fields");
      });
  });
});

describe("GET /api/articles?topic", () => {
  test("GET:200 returns an array of article objects by the defined topic value", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("GET:200 returns an array of all article objects if query is omitted", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles).toHaveLength(13);
      });
  });
  test("GET:200 returns an empty array if queried topic exists but has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([]);
      });
  });
  test("GET:404 returns an error message when there are no articles of queried topic", () => {
    return request(app)
      .get("/api/articles?topic=999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No articles found of this topic!");
      });
  });
});

describe("GET /api/users", () => {
  test("GET:200 responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id?comment_count", () => {
  test("GET:200 responds with an article object by article_id, now including a comment count property as requested by the query", () => {
    return request(app)
      .get("/api/articles/3?comment_count")
      .expect(200)
      .then((response) => {
        const article = response.body;
        const desiredObject = {
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        };
        expect(article).toMatchObject(desiredObject);
      });
  });
  test("GET:404 returns error message when article does not exist", () => {
    return request(app)
      .get("/api/articles/999999?comment_count")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found!");
      });
  });
  test("GET:400 returns error message when bad request (invalid ID) is made", () => {
    return request(app)
      .get("/api/articles/notAnId?comment_count")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
});
