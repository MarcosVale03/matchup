-- 1. Create the Forum Thread table
create table "public"."forum_thread" (
    "id" uuid not null default gen_random_uuid(),
    "author_id" uuid not null,
    "title" character varying not null,
    "content" text not null,
    "created_at" timestamp without time zone not null default now(),
    constraint "forum_thread_pkey" PRIMARY KEY ("id"),
    constraint "forum_thread_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 2. Create the Forum Posts table
create table "public"."forum_posts" (
    "id" uuid not null default gen_random_uuid(),
    "thread_id" uuid not null,
    "author_id" uuid not null,
    "content" text not null default ''::text,
    "created_at" timestamp without time zone not null default now(),
    constraint "forum_posts_pkey" PRIMARY KEY ("id"),
    constraint "forum_posts_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    constraint "forum_posts_thread_id_fkey" FOREIGN KEY (thread_id) REFERENCES public.forum_thread(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 3. Enable RLS
alter table "public"."forum_thread" enable row level security;
alter table "public"."forum_posts" enable row level security;

-- 4. Grant Permissions
grant delete, insert, references, select, trigger, truncate, update on table "public"."forum_thread" to "authenticated", "service_role";
grant delete, insert, references, select, trigger, truncate, update on table "public"."forum_posts" to "authenticated", "service_role";