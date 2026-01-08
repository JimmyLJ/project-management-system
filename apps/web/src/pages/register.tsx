import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { authKeys, signUpWithEmail } from "~/features/auth/api";
import { useAuthSession } from "~/features/auth/hooks";
import { ApiError } from "~/lib/apiClient";

const schema = z
  .object({
    name: z.string().min(1, "请输入用户名"),
    email: z.string().email("请输入有效的邮箱地址"),
    password: z.string().min(6, "密码至少 6 位"),
    confirmPassword: z.string().min(6, "请再次输入密码"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "两次输入的密码不一致",
  });

type RegisterFormValues = z.infer<typeof schema>;

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message || "注册失败，请稍后重试";
  }
  return "注册失败，请稍后重试";
};

export default function Register() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useAuthSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
  });

  const signUpMutation = useMutation({
    mutationFn: signUpWithEmail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.session });
      navigate("/", { replace: true });
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    signUpMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--dash-bg)] text-sm text-slate-500">
        正在加载...
      </div>
    );
  }

  if (session?.user) {
    return <Navigate to="/" replace />;
  }

  const errorMessage = signUpMutation.isError ? getErrorMessage(signUpMutation.error) : "";
  const isBusy = signUpMutation.isPending;

  return (
    <div className="flex min-h-screen items-center bg-[var(--dash-bg)] px-4 py-12 text-[var(--dash-text)]">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
        <div className="px-8 pb-8 pt-10 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">创建项目管理系统账号</h1>
          <p className="mt-2 text-sm text-slate-500">填写信息以完成注册</p>
          <form className="mt-8 text-left" noValidate onSubmit={handleSubmit(onSubmit)}>
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              用户名
            </label>
            <input
              id="name"
              type="text"
              autoComplete="username"
              placeholder="请输入用户名"
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              {...register("name")}
            />
            {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
            <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="email">
              邮箱地址
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="请输入邮箱地址"
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              {...register("email")}
            />
            {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
            <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="password">
              密码
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="请输入密码"
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              {...register("password")}
            />
            {errors.password ? <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p> : null}
            <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
              确认密码
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="请再次输入密码"
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword.message}</p>
            ) : null}
            {errorMessage ? <p className="mt-3 text-sm text-rose-600">{errorMessage}</p> : null}
            <button
              type="submit"
              disabled={isBusy}
              className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isBusy ? "注册中..." : "注册"}
            </button>
          </form>
        </div>
        <div className="border-t border-slate-200/70 px-6 py-4 text-center text-sm text-slate-500">
          已有账号？{" "}
          <a className="font-semibold text-slate-900 hover:text-slate-700" href="/login">
            去登录
          </a>
        </div>
      </div>
    </div>
  );
}
