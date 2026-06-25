
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop policy if exists "Update by owner or approver" on public.leave_requests;
create policy "Update by owner or approver" on public.leave_requests
  for update to authenticated
  using (
    (user_id = auth.uid() and status = 'pending')
    or public.has_role(auth.uid(),'admin')
    or public.is_manager_of(auth.uid(), user_id)
  )
  with check (
    public.has_role(auth.uid(),'admin')
    or public.is_manager_of(auth.uid(), user_id)
    or (user_id = auth.uid() and status in ('pending','cancelled'))
  );
