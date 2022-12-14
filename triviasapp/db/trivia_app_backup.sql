PGDMP                         z        
   trivia_app    14.4    14.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    25901 
   trivia_app    DATABASE     f   CREATE DATABASE trivia_app WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE trivia_app;
                postgres    false            ?            1259    26083    games    TABLE     ?   CREATE TABLE public.games (
    id integer NOT NULL,
    user_id integer NOT NULL,
    score character varying(5) NOT NULL,
    percentage double precision NOT NULL,
    date_game timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.games;
       public         heap    postgres    false            ?            1259    26082    games_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.games_id_seq;
       public          postgres    false    215                       0    0    games_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;
          public          postgres    false    214            ?            1259    25944 	   questions    TABLE     ?   CREATE TABLE public.questions (
    id integer NOT NULL,
    question text NOT NULL,
    correct_answer text NOT NULL,
    incorrect_answer1 text NOT NULL,
    incorrect_answer2 text NOT NULL,
    incorrect_answer3 text,
    incorrect_answer4 text
);
    DROP TABLE public.questions;
       public         heap    postgres    false            ?            1259    25943    questions_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.questions_id_seq;
       public          postgres    false    211                       0    0    questions_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;
          public          postgres    false    210            ?            1259    25902    session    TABLE     ?   CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);
    DROP TABLE public.session;
       public         heap    postgres    false            ?            1259    26072    users    TABLE     ?   CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    is_admin boolean NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            ?            1259    26071    users_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    213                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    212            l           2604    26086    games id    DEFAULT     d   ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);
 7   ALTER TABLE public.games ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            j           2604    25947    questions id    DEFAULT     l   ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);
 ;   ALTER TABLE public.questions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    210    211            k           2604    26075    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    212    213    213                      0    26083    games 
   TABLE DATA           J   COPY public.games (id, user_id, score, percentage, date_game) FROM stdin;
    public          postgres    false    215   ?                  0    25944 	   questions 
   TABLE DATA           ?   COPY public.questions (id, question, correct_answer, incorrect_answer1, incorrect_answer2, incorrect_answer3, incorrect_answer4) FROM stdin;
    public          postgres    false    211   !                 0    25902    session 
   TABLE DATA           4   COPY public.session (sid, sess, expire) FROM stdin;
    public          postgres    false    209   M&       	          0    26072    users 
   TABLE DATA           D   COPY public.users (id, name, email, password, is_admin) FROM stdin;
    public          postgres    false    213   ?'                  0    0    games_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.games_id_seq', 1, false);
          public          postgres    false    214                       0    0    questions_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.questions_id_seq', 29, true);
          public          postgres    false    210                       0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
          public          postgres    false    212            x           2606    26089    games games_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.games DROP CONSTRAINT games_pkey;
       public            postgres    false    215            r           2606    25951    questions questions_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.questions DROP CONSTRAINT questions_pkey;
       public            postgres    false    211            p           2606    25908    session session_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
 >   ALTER TABLE ONLY public.session DROP CONSTRAINT session_pkey;
       public            postgres    false    209            t           2606    26081    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    213            v           2606    26079    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    213            n           1259    25909    IDX_session_expire    INDEX     J   CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);
 (   DROP INDEX public."IDX_session_expire";
       public            postgres    false    209            y           2606    26090    games games_user_id_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 B   ALTER TABLE ONLY public.games DROP CONSTRAINT games_user_id_fkey;
       public          postgres    false    215    3190    213                  x?????? ? ?         &  x?uVMo7=S??p/-??8??F??'?]?2?C??xw$Q??rW?r??(?|)ЃEn???????$?qZC֒Cj8?????ԗϿԬ3o}Ё???]E??????-?&|J9g? ?W<^=&j??K.?J?:?p9??s?Gp?V??,?Gp?y????Z?55Yͱ????????[RO	A?C.?QC8??;KϮ?:????????????v???ӽ1ٸ??yc?]???:]???}??9???|?R%? 9B&]R???@??|A??q???RB????ڪ킂lS?8????E??h???]??ǜB׻??{?????{A3f??U_????r???W?i|\?	.????,?'??v?Z?_?`?5)#??j???PQ_???_???a????????,q???չE???'gP??????????cʽWyA[????YQ?5???????1 3(=r????,O???ju6V$????`/?E?;ls??}??m???[???L7??~?? ?
??A???	??R?yȈ!???[?M??)K?0??y?Plބ?? ?d>??j??h&?H?	??M?ޤB?]?\??'?fm&?Z?????g?S?????;?g?7??t???v????ݺv?lzB?棓????? C)?˳?-}H9-+ry?g?V???YG??Vw}?9?Zm	j'???$?D?5?.?#?Q?g??}Ԗ?>PC?z??{??D???\;???a'??0??ָ1?H?????S[?TEҤ?9?t???T*?<ǩTA>=?D????aw?IٜO	???????fd0??AT?{$kΣȟ??\?=/ꊺ?<?????/??J?Ol)}Y??
?%??H?4?\????d?tl.tab???缎?d	^?<!kM???amK?C視?w?K?N	<&??QSS??}?/??R?7y?1$-?#?(oZV{?>?¾?a?K?V??v??赴|??:f$?-?[ȽQ?)??!q]??t?HU%n???bJ+??8??0?hư8??O[?l?&?x??ҭ?W?o`?A??4B??k ??? 0?Tmu????C	n?J?????wh?`Rgo?I?c?˳ߣFg?|?	Q?=qDs??.??(???u??M???Z????Bx???Lo?fv?]I ?s72?Ts?????K;?cܨW??7Ɲ?q?????彗:k???K???:O?PY?qzo&M_?Ўu?????ĸ??țF?wE??4i? ~<AF ???E?7????a?[????Tp_=휼b?[????A???K>??sr??8???֯?V??/?D0         y  x???Io?0??ͯ??R???Th?M????	??'N?.??^á?P?U??ǣ???7??î?^?q??}?Y??î<??&i??dx???R??@W??HE?d??wR?CZ?6z??K?y"??Q5SQ??1???1?M!?????????!?=?IV?fe?ˊ??^?r?1?E?^??i??wx΄??d3a?/X?hE?ft??FZb߲x ?	KrQ ?1YYE?X????2p	?B9A?????F?????]?立???AO????oY????|DQ????Gp??ɮu????v?
???E;~H?yg?6?R??ex]?????:XԦ-??v?W???V?z???pW?tə??[j?s??y?qqk+??'?q?/R?(      	      x?????? ? ?     