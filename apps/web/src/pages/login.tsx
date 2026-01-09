import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { authKeys, signInWithEmail } from "~/features/auth/api";
import { useAuthSession } from "~/features/auth/hooks";
import { ApiError } from "~/lib/apiClient";

const schema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少 6 位"),
});

type LoginFormValues = z.infer<typeof schema>;

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message || "登录失败，请稍后重试";
  }
  return "登录失败，请稍后重试";
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useAuthSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const signInMutation = useMutation({
    mutationFn: signInWithEmail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.session });
      const state = location.state as { from?: { pathname?: string } } | null;
      const destination = state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    signInMutation.mutate({ email: values.email, password: values.password });
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

  const errorMessage = signInMutation.isError ? getErrorMessage(signInMutation.error) : "";
  const isBusy = signInMutation.isPending;

  return (
    <div className="flex min-h-screen items-center bg-[var(--dash-bg)] px-4 py-12 text-[var(--dash-text)]">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
        <div className="px-8 pb-8 pt-10 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">登录项目管理系统</h1>
          <p className="mt-2 text-sm text-slate-500">欢迎回来，请登录以继续</p>
          <form className="mt-8 text-left" noValidate onSubmit={handleSubmit(onSubmit)}>
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
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
              autoComplete="current-password"
              placeholder="请输入密码"
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              {...register("password")}
            />
            {errors.password ? <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p> : null}
            {errorMessage ? <p className="mt-3 text-sm text-rose-600">{errorMessage}</p> : null}
            <button
              type="submit"
              disabled={isBusy}
              className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isBusy ? "登录中..." : "继续"}
            </button>
          </form>
        </div>
        <div className="border-t border-slate-200/70 px-6 py-4 text-center text-sm text-slate-500">
          没有账号？{" "}
          <a className="font-semibold text-slate-900 hover:text-slate-700" href="/register">
            注册
          </a>
        </div>
      </div>
    </div>
  );
}
