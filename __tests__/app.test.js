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
        expect(article).toMatchObject(desiredArticle)
        expect(article.article_id).toBe(3)
        expect(typeof article).toBe("object");
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
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

