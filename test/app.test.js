const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const assert = chai.assert;

chai.use(chaiHttp);
let testId;
let badId = "65beece2cc122d00e29a7fe0";
describe("testing /category router", () => {
  it("GET /category", async () => {
    const res = await chai.request(server).get("/category");
    assert.equal(res.status, 200);
    assert.isArray(res.body);
  });
  it("GET /category?[name]", async () => {
    const res = await chai.request(server).get("/category?name=Kader");
    assert.equal(res.status, 200);
    assert.equal(res.body[0].name, "Kader");
  });
  it("GET /category/:id (valid id)", async () => {
    const id = "65beece2cc122d00e29a7fe2";
    const res = await chai.request(server).get(`/category/${id}`);
    assert.equal(res.status, 200);
    assert.property(res.body, "name");
    assert.property(res.body, "description");
  });
  it("GET /category/:id (invalid id)", async () => {
    const res = await chai.request(server).get(`/category/${badId}`);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { error: "category not found" });
  });
  it("POST /category", async () => {
    const res = await chai
      .request(server)
      .post("/category")
      .send({ name: "Zoink", description: "blah" });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "Zoink");
    assert.equal(res.body.description, "blah");
    testId = res.body._id;
  });
  it("POST /category (missing name)", async () => {
    const res = await chai
      .request(server)
      .post("/category")
      .send({ description: "blah" });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: "Missing category name" });
  });
  it("PUT /category/:id (valid id)", async () => {
    const res = await chai
      .request(server)
      .put(`/category/${testId}`)
      .send({ name: "Katch", description: "Kader" });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "Katch");
    assert.equal(res.body.description, "Kader");
  });
  it("PUT /category/:id (missing description)", async () => {
    const res = await chai
      .request(server)
      .put("/category/65beece2cc122d00e29a7fe2")
      .send({ name: "Kader" });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "Kader");
    assert.equal(res.body.description, "55");
  });
  it("PUT /category/:id (invalid id)", async () => {
    const res = await chai
      .request(server)
      .put(`/category/${badId}`)
      .send({ name: "Katch", description: "Kader" });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { error: "category not found" });
  });
  it("DELETE /category/:id (valid id)", async () => {
    const res = await chai.request(server).delete(`/category/${testId}`);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { result: "successfully deleted" });
  });
  it("DELETE /category/:id (invalid id)", async () => {
    const res = await chai.request(server).delete(`/category/${badId}`);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { error: "category not found" });
  });
});
describe("testing /item router", () => {
  it("GET /item", async () => {
    const res = await chai.request(server).get("/item");
    assert.equal(res.status, 200);
    assert.isArray(res.body);
  });
  it("POST /item", async () => {
    const res = await chai.request(server).post("/item").send({
      name: "laptop",
      price: 10,
      category: "Kader",
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "laptop");
    assert.equal(res.body.price, 10);
    testId = res.body._id;
  });
  it("GET /item?[name]", async () => {
    const res = await chai.request(server).get("/item?name=laptop");
    assert.equal(res.status, 200);
    assert.equal(res.body[0].name, "laptop");
    assert.equal(res.body[0].price, 10);
  });

  it("GET /item/:id (valid id)", async () => {
    const res = await chai.request(server).get(`/item/${testId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "laptop");
    assert.equal(res.body.price, 10);
  });

  it("GET /item/:id (invalid id)", async () => {
    const res = await chai.request(server).get(`/item/${badId}`);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { error: "item not found" });
  });

  it("POST /item (missing name/price/category)", async () => {
    const res = await chai
      .request(server)
      .post("/item")
      .send({ description: "blah" });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: "missing name/price/category" });
  });

  it("PUT /item/:id (valid id)", async () => {
    const res = await chai
      .request(server)
      .put(`/item/${testId}`)
      .send({ name: "Ambola", description: "Kabola" });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "Ambola");
    assert.equal(res.body.description, "Kabola");
  });

  it("PUT /item/:id (missing description)", async () => {
    const res = await chai
      .request(server)
      .put(`/item/${testId}`)
      .send({ name: "Zabola" });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "Zabola");
  });

  it("PUT /item/:id (invalid id)", async () => {
    const res = await chai
      .request(server)
      .put(`/item/${badId}`)
      .send({ name: "NewName", description: "NewDescription" });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { error: "item not found" });
  });

  it("DELETE /item/:id (valid id)", async () => {
    const res = await chai.request(server).delete(`/item/${testId}`);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { result: "successfully deleted" });
  });

  it("DELETE /item/:id (invalid id)", async () => {
    const res = await chai.request(server).delete(`/item/${badId}`);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { error: "item not found" });
  });
});
