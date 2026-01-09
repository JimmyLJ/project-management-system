import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { useCreateWorkspace } from "./hooks";
import type { Workspace } from "./types";
import { ApiError } from "~/lib/apiClient";

const schema = z.object({
  name: z
    .string()
    .min(2, "名称至少 2 个字符")
    .max(50, "名称最多 50 个字符"),
  slug: z
    .string()
    .min(2, "Slug 至少 2 个字符")
    .max(30, "Slug 最多 30 个字符")
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/, "只能包含小写字母、数字和连字符"),
});

type FormValues = z.infer<typeof schema>;

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  closable?: boolean;
  onSuccess?: (workspace: Workspace) => void;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message || "创建失败，请稍后重试";
  }
  return "创建失败，请稍后重试";
};

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
  closable = true,
  onSuccess,
}: CreateWorkspaceDialogProps) {
  const createMutation = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: (workspace) => {
        reset();
        onSuccess?.(workspace);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!closable && !newOpen) return;
    onOpenChange?.(newOpen);
  };

  const errorMessage = createMutation.isError ? getErrorMessage(createMutation.error) : "";
  const isBusy = createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={closable}
        onPointerDownOutside={(e) => {
          if (!closable) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!closable) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>创建工作区</DialogTitle>
          <DialogDescription>创建一个新的工作区以开始管理项目。</DialogDescription>
        </DialogHeader>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="name">
              名称
            </label>
            <input
              id="name"
              type="text"
              placeholder="工作区名称"
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
              {...register("name")}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              placeholder="my-workspace"
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
              {...register("slug")}
            />
            {errors.slug && <p className="mt-1 text-xs text-rose-600">{errors.slug.message}</p>}
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              用于 URL，只能包含小写字母、数字和连字符
            </p>
          </div>

          {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isBusy}
              className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:bg-slate-300"
            >
              {isBusy ? "创建中..." : "创建工作区"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
