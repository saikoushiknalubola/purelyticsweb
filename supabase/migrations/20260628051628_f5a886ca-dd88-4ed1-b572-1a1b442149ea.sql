
CREATE POLICY "people_docs_select" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'people-documents' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.has_role(auth.uid(),'admin')
      OR public.is_manager_of(auth.uid(), ((storage.foldername(name))[1])::uuid)
    )
  );
CREATE POLICY "people_docs_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'people-documents' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.has_role(auth.uid(),'admin')
    )
  );
CREATE POLICY "people_docs_update" ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'people-documents' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.has_role(auth.uid(),'admin')
    )
  );
CREATE POLICY "people_docs_delete" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'people-documents' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.has_role(auth.uid(),'admin')
    )
  );
