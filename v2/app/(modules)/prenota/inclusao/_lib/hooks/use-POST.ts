import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { postPreNota } from "@inclusao/api";
import type {
  PreNotaDraft,
  PostPreNotaResponse,
} from "@inclusao/types";

export function usePostPreNota(): UseMutationResult<
  PostPreNotaResponse,
  Error,
  PreNotaDraft | void
> {
  return useMutation<PostPreNotaResponse, Error, PreNotaDraft | void>({
    mutationFn: (draft) => postPreNota(draft as PreNotaDraft | undefined),
  });
}
