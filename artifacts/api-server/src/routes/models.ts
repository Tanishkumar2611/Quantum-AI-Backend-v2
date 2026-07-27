import { Router, type IRouter } from "express";
import { GetModelResponse, ListModelsResponse } from "@workspace/api-zod";
import z from "zod";
import { MODEL_REGISTRY, findModel } from "../data/models";

const router: IRouter = Router();

const ErrorResponse = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});

router.get("/v1/models", (_req, res) => {
  const data = ListModelsResponse.parse({
    object: "list",
    data: MODEL_REGISTRY,
    total: MODEL_REGISTRY.length,
  });
  res.json(data);
});

router.get("/v1/models/:modelId", (req, res) => {
  const model = findModel(req.params["modelId"] ?? "");

  if (!model) {
    const err = ErrorResponse.parse({
      error: {
        code: "model_not_found",
        message: `Model '${req.params["modelId"]}' does not exist.`,
      },
    });
    res.status(404).json(err);
    return;
  }

  const data = GetModelResponse.parse(model);
  res.json(data);
});

export default router;
