class MockModel {
  constructor(data) { Object.assign(this, data); }
  static async find() { return []; }
  static async findOne() { return null; }
  static async findById() { return null; }
  static populate() { return this; }
  static sort() { return this; }
  static limit() { return this; }
  static exec() { return []; }
  async save() { return this; }
  static async findOneAndUpdate() { return null; }
  static async findOneAndDelete() { return null; }
  static aggregate() { return []; }
}

module.exports = {
  Schema: class Schema {
    constructor(obj) { this.obj = obj; }
    index() {} // mock index method
    static Types = { ObjectId: String };
  },
  model: (name, schema) => MockModel,
  Types: { ObjectId: String }
};
