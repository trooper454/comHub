--
-- PostgreSQL database dump
--

\restrict fNFqPI8BLMcfedooDhmycNIlgLsLFpVE58XIKvnaqIKZG9fUkJTJqCmFinaNVe9

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-02-14 14:55:01 MST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16390)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3664 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 16625)
-- Name: channel_overwrites; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.channel_overwrites (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    channel_id uuid NOT NULL,
    target_id uuid NOT NULL,
    target_type text NOT NULL,
    allow bigint DEFAULT 0,
    deny bigint DEFAULT 0,
    CONSTRAINT channel_overwrites_target_type_check CHECK ((target_type = ANY (ARRAY['user'::text, 'role'::text])))
);


ALTER TABLE public.channel_overwrites OWNER TO comhubdb;

--
-- TOC entry 226 (class 1259 OID 16526)
-- Name: channels; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.channels (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    server_id uuid CONSTRAINT channels_guild_id_not_null NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    "position" integer DEFAULT 0,
    parent_id uuid,
    is_private boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT channels_type_check CHECK ((type = ANY (ARRAY['text'::text, 'voice'::text, 'stage'::text, 'announcement'::text])))
);


ALTER TABLE public.channels OWNER TO comhubdb;

--
-- TOC entry 221 (class 1259 OID 16423)
-- Name: families; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.families (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    owner_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.families OWNER TO comhubdb;

--
-- TOC entry 222 (class 1259 OID 16440)
-- Name: family_members; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.family_members (
    family_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text NOT NULL,
    joined_at timestamp with time zone DEFAULT now(),
    CONSTRAINT family_members_role_check CHECK ((role = ANY (ARRAY['parent'::text, 'child'::text, 'guardian'::text])))
);


ALTER TABLE public.family_members OWNER TO comhubdb;

--
-- TOC entry 223 (class 1259 OID 16462)
-- Name: family_restrictions; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.family_restrictions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    family_id uuid NOT NULL,
    child_id uuid NOT NULL,
    max_daily_hours integer DEFAULT 180,
    allowed_server_ids uuid[] DEFAULT '{}'::uuid[],
    voice_muted_by_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.family_restrictions OWNER TO comhubdb;

--
-- TOC entry 227 (class 1259 OID 16552)
-- Name: messages; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    channel_id uuid NOT NULL,
    author_id uuid NOT NULL,
    content text NOT NULL,
    edited_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.messages OWNER TO comhubdb;

--
-- TOC entry 232 (class 1259 OID 16717)
-- Name: server_invites; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.server_invites (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    server_id uuid NOT NULL,
    code text NOT NULL,
    created_by uuid,
    expires_at timestamp with time zone,
    max_uses integer,
    uses integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.server_invites OWNER TO comhubdb;

--
-- TOC entry 225 (class 1259 OID 16506)
-- Name: server_members; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.server_members (
    server_id uuid CONSTRAINT guild_members_guild_id_not_null NOT NULL,
    user_id uuid CONSTRAINT guild_members_user_id_not_null NOT NULL,
    nickname text,
    joined_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.server_members OWNER TO comhubdb;

--
-- TOC entry 224 (class 1259 OID 16489)
-- Name: servers; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.servers (
    id uuid DEFAULT public.uuid_generate_v4() CONSTRAINT guilds_id_not_null NOT NULL,
    name text CONSTRAINT guilds_name_not_null NOT NULL,
    owner_id uuid CONSTRAINT guilds_owner_id_not_null NOT NULL,
    icon_url text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.servers OWNER TO comhubdb;

--
-- TOC entry 231 (class 1259 OID 16683)
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.user_sessions (
    id text NOT NULL,
    user_id uuid NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_sessions OWNER TO comhubdb;

--
-- TOC entry 229 (class 1259 OID 16606)
-- Name: user_voice_channels; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.user_voice_channels (
    user_id uuid NOT NULL,
    channel_id uuid NOT NULL,
    is_speaking boolean DEFAULT false,
    joined_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_voice_channels OWNER TO comhubdb;

--
-- TOC entry 220 (class 1259 OID 16401)
-- Name: users; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username text NOT NULL,
    display_name text DEFAULT ''::text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    avatar_url text,
    status text DEFAULT 'online'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT users_username_check CHECK (((length(username) >= 3) AND (length(username) <= 32)))
);


ALTER TABLE public.users OWNER TO comhubdb;

--
-- TOC entry 228 (class 1259 OID 16575)
-- Name: voice_states; Type: TABLE; Schema: public; Owner: comhubdb
--

CREATE TABLE public.voice_states (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    server_id uuid CONSTRAINT voice_states_guild_id_not_null NOT NULL,
    channel_id uuid,
    self_mute boolean DEFAULT false,
    self_deaf boolean DEFAULT false,
    server_mute boolean DEFAULT false,
    server_deaf boolean DEFAULT false,
    joined_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.voice_states OWNER TO comhubdb;

--
-- TOC entry 3479 (class 2606 OID 16641)
-- Name: channel_overwrites channel_overwrites_channel_id_target_id_target_type_key; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.channel_overwrites
    ADD CONSTRAINT channel_overwrites_channel_id_target_id_target_type_key UNIQUE (channel_id, target_id, target_type);


--
-- TOC entry 3481 (class 2606 OID 16639)
-- Name: channel_overwrites channel_overwrites_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.channel_overwrites
    ADD CONSTRAINT channel_overwrites_pkey PRIMARY KEY (id);


--
-- TOC entry 3469 (class 2606 OID 16541)
-- Name: channels channels_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_pkey PRIMARY KEY (id);


--
-- TOC entry 3457 (class 2606 OID 16434)
-- Name: families families_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.families
    ADD CONSTRAINT families_pkey PRIMARY KEY (id);


--
-- TOC entry 3459 (class 2606 OID 16451)
-- Name: family_members family_members_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.family_members
    ADD CONSTRAINT family_members_pkey PRIMARY KEY (family_id, user_id);


--
-- TOC entry 3461 (class 2606 OID 16478)
-- Name: family_restrictions family_restrictions_family_id_child_id_key; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.family_restrictions
    ADD CONSTRAINT family_restrictions_family_id_child_id_key UNIQUE (family_id, child_id);


--
-- TOC entry 3463 (class 2606 OID 16476)
-- Name: family_restrictions family_restrictions_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.family_restrictions
    ADD CONSTRAINT family_restrictions_pkey PRIMARY KEY (id);


--
-- TOC entry 3467 (class 2606 OID 16515)
-- Name: server_members guild_members_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.server_members
    ADD CONSTRAINT guild_members_pkey PRIMARY KEY (server_id, user_id);


--
-- TOC entry 3465 (class 2606 OID 16500)
-- Name: servers guilds_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.servers
    ADD CONSTRAINT guilds_pkey PRIMARY KEY (id);


--
-- TOC entry 3471 (class 2606 OID 16564)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3488 (class 2606 OID 16732)
-- Name: server_invites server_invites_code_key; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.server_invites
    ADD CONSTRAINT server_invites_code_key UNIQUE (code);


--
-- TOC entry 3490 (class 2606 OID 16730)
-- Name: server_invites server_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.server_invites
    ADD CONSTRAINT server_invites_pkey PRIMARY KEY (id);


--
-- TOC entry 3485 (class 2606 OID 16693)
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3477 (class 2606 OID 16614)
-- Name: user_voice_channels user_voice_channels_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.user_voice_channels
    ADD CONSTRAINT user_voice_channels_pkey PRIMARY KEY (user_id, channel_id);


--
-- TOC entry 3451 (class 2606 OID 16422)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3453 (class 2606 OID 16418)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3455 (class 2606 OID 16420)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3473 (class 2606 OID 16588)
-- Name: voice_states voice_states_pkey; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.voice_states
    ADD CONSTRAINT voice_states_pkey PRIMARY KEY (id);


--
-- TOC entry 3475 (class 2606 OID 16590)
-- Name: voice_states voice_states_user_id_guild_id_key; Type: CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.voice_states
    ADD CONSTRAINT voice_states_user_id_guild_id_key UNIQUE (user_id, server_id);


--
-- TOC entry 3486 (class 1259 OID 16743)
-- Name: idx_server_invites_code; Type: INDEX; Schema: public; Owner: comhubdb
--

CREATE INDEX idx_server_invites_code ON public.server_invites USING btree (code);


--
-- TOC entry 3482 (class 1259 OID 16700)
-- Name: idx_sessions_expires; Type: INDEX; Schema: public; Owner: comhubdb
--

CREATE INDEX idx_sessions_expires ON public.user_sessions USING btree (expires_at);


--
-- TOC entry 3483 (class 1259 OID 16699)
-- Name: idx_sessions_user; Type: INDEX; Schema: public; Owner: comhubdb
--

CREATE INDEX idx_sessions_user ON public.user_sessions USING btree (user_id);


--
-- TOC entry 3508 (class 2606 OID 16642)
-- Name: channel_overwrites channel_overwrites_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.channel_overwrites
    ADD CONSTRAINT channel_overwrites_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id) ON DELETE CASCADE;


--
-- TOC entry 3499 (class 2606 OID 16547)
-- Name: channels channels_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.channels(id) ON DELETE SET NULL;


--
-- TOC entry 3500 (class 2606 OID 16712)
-- Name: channels channels_server_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_server_id_fkey FOREIGN KEY (server_id) REFERENCES public.servers(id) ON DELETE CASCADE;


--
-- TOC entry 3491 (class 2606 OID 16435)
-- Name: families families_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.families
    ADD CONSTRAINT families_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3492 (class 2606 OID 16452)
-- Name: family_members family_members_family_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.family_members
    ADD CONSTRAINT family_members_family_id_fkey FOREIGN KEY (family_id) REFERENCES public.families(id) ON DELETE CASCADE;


--
-- TOC entry 3493 (class 2606 OID 16457)
-- Name: family_members family_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.family_members
    ADD CONSTRAINT family_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3494 (class 2606 OID 16484)
-- Name: family_restrictions family_restrictions_child_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.family_restrictions
    ADD CONSTRAINT family_restrictions_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3495 (class 2606 OID 16479)
-- Name: family_restrictions family_restrictions_family_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.family_restrictions
    ADD CONSTRAINT family_restrictions_family_id_fkey FOREIGN KEY (family_id) REFERENCES public.families(id) ON DELETE CASCADE;


--
-- TOC entry 3496 (class 2606 OID 16501)
-- Name: servers guilds_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.servers
    ADD CONSTRAINT guilds_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3501 (class 2606 OID 16570)
-- Name: messages messages_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3502 (class 2606 OID 16565)
-- Name: messages messages_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id) ON DELETE CASCADE;


--
-- TOC entry 3510 (class 2606 OID 16738)
-- Name: server_invites server_invites_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.server_invites
    ADD CONSTRAINT server_invites_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3511 (class 2606 OID 16733)
-- Name: server_invites server_invites_server_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.server_invites
    ADD CONSTRAINT server_invites_server_id_fkey FOREIGN KEY (server_id) REFERENCES public.servers(id) ON DELETE CASCADE;


--
-- TOC entry 3497 (class 2606 OID 16702)
-- Name: server_members server_members_server_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.server_members
    ADD CONSTRAINT server_members_server_id_fkey FOREIGN KEY (server_id) REFERENCES public.servers(id) ON DELETE CASCADE;


--
-- TOC entry 3498 (class 2606 OID 16707)
-- Name: server_members server_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.server_members
    ADD CONSTRAINT server_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3509 (class 2606 OID 16694)
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3506 (class 2606 OID 16620)
-- Name: user_voice_channels user_voice_channels_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.user_voice_channels
    ADD CONSTRAINT user_voice_channels_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id) ON DELETE CASCADE;


--
-- TOC entry 3507 (class 2606 OID 16615)
-- Name: user_voice_channels user_voice_channels_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.user_voice_channels
    ADD CONSTRAINT user_voice_channels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3503 (class 2606 OID 16601)
-- Name: voice_states voice_states_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.voice_states
    ADD CONSTRAINT voice_states_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id) ON DELETE SET NULL;


--
-- TOC entry 3504 (class 2606 OID 16596)
-- Name: voice_states voice_states_guild_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.voice_states
    ADD CONSTRAINT voice_states_guild_id_fkey FOREIGN KEY (server_id) REFERENCES public.servers(id) ON DELETE CASCADE;


--
-- TOC entry 3505 (class 2606 OID 16591)
-- Name: voice_states voice_states_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: comhubdb
--

ALTER TABLE ONLY public.voice_states
    ADD CONSTRAINT voice_states_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-02-14 14:55:01 MST

--
-- PostgreSQL database dump complete
--

\unrestrict fNFqPI8BLMcfedooDhmycNIlgLsLFpVE58XIKvnaqIKZG9fUkJTJqCmFinaNVe9

