-- Ensure orders table has full replica identity for realtime
ALTER TABLE public.orders REPLICA IDENTITY FULL;