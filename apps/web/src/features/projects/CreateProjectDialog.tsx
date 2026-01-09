import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, Check, ChevronDown } from "lucide-react";
import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useCreateProject } from "./hooks";
import type { CreateProjectPayload, ProjectPriority, ProjectStatus } from "./types";
import { ApiError } from "~/lib/apiClient";
import { useWorkspaceMembers } from "~/features/workspace/hooks";

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "规划中" },
  { value: "active", label: "进行中" },
  { value: "completed", label: "已完成" },
  { value: "on_hold", label: "暂停" },
  { value: "cancelled", label: "已取消" },
];

const priorityOptions: { value: ProjectPriority; label: string }[] = [
  { value: "low", label: "低" },
  { value: "medium", label: "中" },
  { value: "high", label: "高" },
];

const schema = z
  .object({
    name: z.string().min(2, "项目名称至少 2 个字符").max(200, "项目名称最多 200 个字符"),
    description: z.string().max(500, "描述最多 500 个字符").optional(),
    status: z.enum(["planning", "active", "completed", "on_hold", "cancelled"]),
    priority: z.enum(["low", "medium", "high"]),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    leadId: z.string().nullable().optional(),
    memberIds: z.array(z.string()).optional(),
  })
  .refine((data) => {
    if (!data.startDate || !data.endDate) return true;
    return data.endDate >= data.startDate;
  }, {
    message: "结束日期不能早于开始日期",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof schema>;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId?: string;
  workspaceName?: string;
  onSuccess?: () => void;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message || "创建失败，请稍后重试";
  }
  return "创建失败，请稍后重试";
};

export function CreateProjectDialog({
  open,
  onOpenChange,
  workspaceId,
  workspaceName,
  onSuccess,
}: CreateProjectDialogProps) {
  const createMutation = useCreateProject();
  const { data: members = [], isLoading: isMembersLoading } = useWorkspaceMembers(workspaceId);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      status: "planning",
      priority: "medium",
      startDate: undefined,
      endDate: undefined,
      leadId: null,
      memberIds: [],
    },
  });

  const memberOptions = useMemo(
    () =>
      members.map((member) => ({
        value: member.id,
        label: member.name || member.email,
      })),
    [members],
  );
  const memberMap = useMemo(() => new Map(memberOptions.map((option) => [option.value, option])), [memberOptions]);

  const onSubmit = (values: FormValues) => {
    if (!workspaceId) return;
    const payload: CreateProjectPayload = {
      workspaceId,
      name: values.name.trim(),
      description: values.description?.trim() || null,
      status: values.status,
      priority: values.priority,
      startDate: values.startDate ? format(values.startDate, "yyyy-MM-dd") : null,
      endDate: values.endDate ? format(values.endDate, "yyyy-MM-dd") : null,
      leadId: values.leadId ?? null,
      memberIds: values.memberIds ?? [],
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  const errorMessage = createMutation.isError ? getErrorMessage(createMutation.error) : "";
  const isBusy = createMutation.isPending;
  const canSubmit = Boolean(workspaceId) && !isBusy;
  const workspaceLabel = workspaceName ? (
    <span>
      工作区：<span className="font-semibold text-[var(--dash-primary)]">{workspaceName}</span>
    </span>
  ) : (
    "工作区：--"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-4rem)] max-w-[560px] overflow-hidden p-0">
        <div className="max-h-[calc(100vh-7rem)] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>创建新项目</DialogTitle>
            <DialogDescription>{workspaceLabel}</DialogDescription>
          </DialogHeader>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="project-name">
                项目名称
              </label>
              <input
                id="project-name"
                type="text"
                placeholder="输入项目名称"
                className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                {...register("name")}
              />
              {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="project-description">
                描述
              </label>
              <textarea
                id="project-description"
                placeholder="描述你的项目"
                rows={3}
                className="mt-2 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                {...register("description")}
              />
              {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  状态
                </label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  优先级
                </label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  开始日期
                </label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/70"
                        >
                          <span>{field.value ? format(field.value, "yyyy/MM/dd") : "年/月/日"}</span>
                          <CalendarIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  结束日期
                </label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/70"
                        >
                          <span>{field.value ? format(field.value, "yyyy/MM/dd") : "年/月/日"}</span>
                          <CalendarIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.endDate && <p className="mt-1 text-xs text-rose-600">{errors.endDate.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                项目负责人
              </label>
              <Controller
                control={control}
                name="leadId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? "none"}
                    onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                    disabled={isMembersLoading}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder={isMembersLoading ? "正在加载..." : "选择负责人"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">无负责人</SelectItem>
                      {isMembersLoading ? (
                        <SelectItem value="loading" disabled>
                          正在加载成员...
                        </SelectItem>
                      ) : memberOptions.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          暂无可选成员
                        </SelectItem>
                      ) : (
                        memberOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                团队成员
              </label>
              <Controller
                control={control}
                name="memberIds"
                render={({ field }) => {
                  const selectedIds = field.value ?? [];
                  const selectedMembers = selectedIds
                    .map((id) => memberMap.get(id))
                    .filter((member): member is NonNullable<typeof member> => Boolean(member));
                  const summaryText =
                    selectedMembers.length > 0
                      ? `已选择 ${selectedMembers.length} 人`
                      : memberOptions.length === 0
                        ? "暂无可选成员"
                        : "选择团队成员";

                  const toggleMember = (memberId: string) => {
                    if (selectedIds.includes(memberId)) {
                      field.onChange(selectedIds.filter((id) => id !== memberId));
                      return;
                    }
                    field.onChange([...selectedIds, memberId]);
                  };

                  return (
                    <>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            disabled={isMembersLoading}
                            className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/70"
                          >
                            <span className={selectedMembers.length > 0 ? "" : "text-slate-400 dark:text-slate-500"}>
                              {isMembersLoading ? "正在加载..." : summaryText}
                            </span>
                            <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[260px] p-2" align="start">
                          {isMembersLoading ? (
                            <div className="px-2 py-1 text-sm text-slate-500">正在加载成员...</div>
                          ) : memberOptions.length === 0 ? (
                            <div className="px-2 py-1 text-sm text-slate-500">暂无可选成员</div>
                          ) : (
                            <div className="max-h-48 space-y-1 overflow-y-auto">
                              {memberOptions.map((option) => {
                                const selected = selectedIds.includes(option.value);
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleMember(option.value)}
                                    className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                  >
                                    <span>{option.label}</span>
                                    {selected ? <Check className="h-4 w-4 text-emerald-500" /> : null}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                      {selectedMembers.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedMembers.map((member) => (
                            <span
                              key={member.value}
                              className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                            >
                              {member.label}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </>
                  );
                }}
              />
            </div>

            {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}
            {!workspaceId && <p className="text-sm text-rose-600">当前没有可用的工作区</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-md bg-[var(--dash-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--dash-primary-strong)] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isBusy ? "创建中..." : "创建项目"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
