const asyncHandler = require("express-async-handler");
const Apierror = require("../utiles/apierror");
const Apifeature = require("../utiles/apifeature");

exports.deleteone = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document)
      return next(new Apierror(`invalid brand id for this id: ${id}`, 404));
      //trigger "remove" event when delete  document
        await document.deleteOne();
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document)
      return next(
        new Apierror(`invalid document id for this id: ${req.params.id}`, 404)
      );
      //trigger"save" events when update document 
      document.save();
    res.status(200).json({ data: document });
  });

exports.CreateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newdocument = await Model.create(req.body);
    res.status(201).json({ data: newdocument });
  });

exports.getOne = (Model, PopulateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //1-Build query
    let query = Model.findById(id);
    if (PopulateOpt) {
      query = query.populate(PopulateOpt);
    }
    //2-Execute query
    document = await query;
    if (!document) {
      //res.status(404).json({msg:`nodocument for this id${id}`})
      return next(new Apierror(`nodocument for this id${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getall = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterobject) {
      filter = req.filterobject;
    }
    //Build query
    const countDocument = await Model.countDocuments();
    const apifeature = new Apifeature(Model.find(filter), req.query)
      .filter()
      .pagination(countDocument)
      .search(modelName)
      .limitFileds()
      .sort();
    const { mongoosequery, paginationResult } = apifeature;
    const documents = await mongoosequery;
    res
      .status(200)
      .json({ result: documents.length, paginationResult, data: documents });
  });
