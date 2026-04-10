'use client';

import { useState, useEffect, useMemo } from 'react';
import { FiExternalLink, FiSearch, FiStar, FiX } from 'react-icons/fi';

interface LinkItem {
  label: string;
  url: string;
  description?: string;
}

interface LinkGroup {
  title: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  links: LinkItem[];
}

const LINK_GROUPS: LinkGroup[] = [
  {
    title: 'Environments',
    icon: '🌐',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    links: [
      { label: '🔴 Live (Clarity)', url: 'https://clarity.pinnaclefundservices.com/',        description: 'Production — PRD' },
      { label: '🟣 UAT',            url: 'https://uat.pinnaclefundservices.com/dashboard',    description: 'User Acceptance Testing' },
      { label: '🟠 Dev',            url: 'https://dev.pinnaclefundservices.com/login',        description: 'Development / staging' },
      { label: '🔵 Demo',           url: 'https://demo.pinnaclefundservices.com',             description: 'Demo / presentation' },
      { label: '⬜ Test',           url: 'https://test.pinnaclefundservices.com',             description: 'QA & integration testing' },
    ],
  },
  {
    title: 'Pinnacle',
    icon: '🏗️',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    links: [
      { label: 'Jira',                   url: 'https://bacancy-pinnacle-clarity.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog?source=peopleMenu&cloudId=9be49fec-0cf1-47fd-919d-141cf897a4d7&atlOrigin=eyJwIjoiaiIsImkiOiI3ZTBjZDU4YjNkMWQ0MTYwOTg3MjBkODU2MjhmOWEwMiJ9', description: 'Project backlog & sprints' },
      { label: 'Confluence',             url: 'https://bacancy-pinnacle-clarity.atlassian.net/wiki/spaces/PICL/overview',                                                                                                                                                                description: 'Project documentation' },
      { label: 'Pinnacle App (Dev)',      url: 'https://dev.pinnaclefundservices.com/permissions',                                                                                                                                                                                       description: 'Dev environment — permissions' },
      { label: 'QA Bug Tracker',         url: 'https://pinnaclebugs.vercel.app/',                                                                                                                                                                                                        description: 'This app — on Vercel' },
      { label: 'pinnacle_backend (Git)',  url: 'https://dev.azure.com/pfs-bacancy/bacancy-dev/_git/pinnacle_backend',                                                                                                                                                                     description: 'Azure DevOps repository' },
      { label: 'Swagger — Local (5000)', url: 'http://localhost:5000/swagger/index.html',                                                                                                                                                                                                 description: 'Local API docs — port 5000' },
      { label: 'Swagger — Dev',          url: 'https://backend.4.206.140.84.nip.io/swagger/index.html#/Users/Users_GetList',                                                                                                                                                              description: 'Dev server swagger' },
      { label: 'Swagger — Prod',         url: 'http://backend.20.220.33.144.nip.io/swagger/index.html#/Tokens/Tokens_GetToken',                                                                                                                                                           description: 'Production server swagger' },
      { label: 'Twilio Console',         url: 'https://console.twilio.com/',                                                                                                                                                                                                              description: 'SMS / messaging service' },
      { label: 'Azure Portal',           url: 'https://portal.azure.com/?l=en.en-us#@pinnaclefundservices.com/resource/subscriptions/b3c76005-a819-4fec-a887-6abbd0712584/resourceGroups/PF-RES-GROUP-BACANCY/providers/Microsoft.Storage/storageAccounts/pfsabacancy/storagebrowser',   description: 'Azure storage browser' },
      { label: 'Clarity Doc',            url: 'https://docs.google.com/document/d/1BHowPnbzeButkYdAl8wLoya6CWcelgES/edit',                                                                                                                                                               description: 'Pinnacle Clarity - Bacancy.docx' },
      { label: 'Database Fields Sheet',  url: 'https://docs.google.com/spreadsheets/d/13qX4Da7E0mHfTQnf1QFcxiDIWnRmtTHN/edit?gid=983139644#gid=983139644',                                                                                                                              description: 'Pinnacle DB fields reference' },
      { label: 'Client Feedback Sheet',  url: 'https://docs.google.com/spreadsheets/d/1ZFLbK2nO6kdRuqu9JHJyDsWHevCH9ZcyDoxTeKDSrmA/edit?gid=0#gid=0',                                                                                                                                  description: 'Pinnacle client feedback' },
      { label: 'Week-wise Deliverables', url: 'https://docs.google.com/spreadsheets/d/1IuGjRH0UtcL1XMWWlYP0dB41dIccu7Ua/edit?usp=sharing&ouid=111873900737599221198&rtpof=true&sd=true',                                                                                                description: 'Deliverables tracker' },
      { label: 'SQL Server Maintenance', url: 'https://ola.hallengren.com/downloads.html',                                                                                                                                                                                                description: 'Hallengren solution downloads' },
      { label: 'SQL Index & Stats',      url: 'https://ola.hallengren.com/sql-server-index-and-statistics-maintenance.html',                                                                                                                                                               description: 'Index & stats maintenance' },
    ],
  },
  {
    title: 'Thenamaris',
    icon: '🚢',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    links: [
      { label: 'ASPE Figma (Prototype)', url: 'https://www.figma.com/proto/phO4zmNv3gfSBQ8xYNsXeK/ASPE-(Thenamaris)?node-id=14-1907&node-type=frame&t=ruZV5qNuVV6aZMw9-0&scaling=contain&content-scaling=fixed&page-id=0%3A1', description: 'Figma prototype view' },
      { label: 'ASPE Figma (Design)',    url: 'https://www.figma.com/design/phO4zmNv3gfSBQ8xYNsXeK/ASPE-(Thenamaris)?node-id=6-889&node-type=frame&t=p7ADklLZmy7Wbeys-0',                                                      description: 'Figma design file' },
      { label: 'On Board Attendance',    url: 'https://businessapps-uat.thenamaris.com/onboardattendance',                                                                                                                         description: 'UAT attendance portal' },
      { label: 'Swagger (Port 81)',      url: 'http://localhost:81/swagger/index.html',                                                                                                                                            description: 'Local API docs — port 81' },
      { label: 'Features List',          url: 'https://docs.google.com/spreadsheets/d/1bhhahiCR-QrcjvT8vEBHLT2XQ_xBT_nX/edit?gid=2069155107#gid=2069155107',                                                                    description: 'Developer features sheet' },
      { label: 'Issues (SharePoint)',    url: 'https://thenamarisfiles.sharepoint.com/sites/2024-PL-05/Lists/Issues/AllItems.aspx?e=3%3Aa9087eff0f7e43d68fd9dbaf2d7a13b7&sharingv2=true&fromShare=true&at=9&CID=f4eed6f0%2D7960%2D4f69%2Dbdb9%2D52edca4a9ba7', description: '2024-PL-05 evaluation issues' },
    ],
  },
  {
    title: 'Regent',
    icon: '🎓',
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    links: [
      { label: 'Regent Automation',  url: 'https://commandcenter.regenteducation.net/instances',                                                                                                                                                                                                                                                                                           description: 'Command center — instances' },
      { label: 'Jira',               url: 'https://regenteducation.atlassian.net/browse/RS-26360',                                                                                                                                                                                                                                                                                         description: 'Regent Jira board' },
      { label: 'Jira Dashboard',     url: 'https://regenteducation.atlassian.net/jira/dashboards/14037',                                                                                                                                                                                                                                                                                   description: '6.10.0.0 — JIRA dashboard' },
      { label: 'Tempo',              url: 'https://regenteducation.atlassian.net/plugins/servlet/ac/io.tempo.jira/tempo-app#!/my-work/week?type=LIST&date=2025-03-10',                                                                                                                                                                                                                      description: 'Time tracking — JIRA' },
      { label: 'Sign in to Regent',  url: 'https://auth.regenteducation.net/realms/regent/protocol/openid-connect/auth?response_type=code&scope=openid&state=abf29bb7fe89d30afcb6988afc39475b41f187eb73ae36bab61fa12747ee33f5&redirect_uri=https%3A%2F%2Fcommandcenter.regenteducation.net%2Fapi%2Fauth%2Fcallback%2Fregent&client_id=regentautomateui',   description: 'Regent authentication' },
      { label: 'Outlook (Regent)',   url: 'https://outlook.office.com/mail/?realm=regenteducation.com&exsvurl=1&ll-cc=1033&modurl=0&url=%2fowa%2f%3frealm%253dregenteducation.com%2526exsvurl%253d1%2526ll-cc%253d1033%2526modurl%253d0%2526login_hint%253dalpesh.maniya%252540regenteducation.com',                                                           description: 'Alpesh Maniya — Regent mail' },
      { label: 'REM — Bitbucket',    url: 'https://bitbucket.org/regenteducation/regent-rem/src/main/',                                                                                                                                                                                                                                                                                    description: 'regent-rem repository' },
      { label: 'RDB — Bitbucket',    url: 'https://bitbucket.org/regenteducation/regent-rdb/src/main/',                                                                                                                                                                                                                                                                                    description: 'regent-rdb repository' },
      { label: 'NX — Bitbucket',     url: 'https://bitbucket.org/regenteducation/regent-nx/src/main/',                                                                                                                                                                                                                                                                                    description: 'regent-nx repository' },
      { label: 'SNAP — Bitbucket',   url: 'https://bitbucket.org/regenteducation/regent-snap/src/main/',                                                                                                                                                                                                                                                                                   description: 'regent-snap repository' },
      { label: 'RNA — Bitbucket',    url: 'https://bitbucket.org/regenteducation/regent-rna/src/main/',                                                                                                                                                                                                                                                                                    description: 'regent-rna repository' },
      { label: 'Mahakurukshetra.md', url: 'https://gist.github.com/kokhp/63dfb9483c1107408d095c52f7e1d7e5',                                                                                                                                                                                                                                                                               description: 'GitHub Gist' },
    ],
  },
  {
    title: 'Bacancy',
    icon: '🏢',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    links: [
      { label: 'Keka — Leave Summary',      url: 'https://bacancy.keka.com/#/me/leave/summary',                                                                                                                                 description: 'HR leave management' },
      { label: 'Keka — Expenses',           url: 'https://bacancy.keka.com/#/me/expenses/add',                                                                                                                                  description: 'Add expense claim' },
      { label: 'PMS',                       url: 'http://pms.bacancy.com/employees/sign_in',                                                                                                                                    description: 'Project management system' },
      { label: '.Net Requirement Sheet',    url: 'https://docs.google.com/spreadsheets/d/1VZVsNtRH3_ekCtbKcmdnMQgdEiSgjj1P10c7_JUHQoQ/edit?gid=1602748084#gid=1602748084',                                                    description: '.NET requirements — Sheets' },
      { label: 'Meeting & Room Bookings',   url: 'https://docs.google.com/document/d/1ESkxdL_BWGHqbS94Rsk1UvxSxJsgl7blLx9OEh-kkUg/edit',                                                                                      description: 'Conference room booking doc' },
      { label: 'Interviewers Availability', url: 'https://docs.google.com/spreadsheets/d/1hSyfxY6McNGsyrQu52yTiKmsXk5EY2qi-rS9zSVxwPw/edit#gid=1577159279',                                                                   description: '2023/2024 availability sheet' },
      { label: 'Udemy — Azure AD & B2C',   url: 'https://www.udemy.com/join/login-popup/?next=/course/azure-ad-and-azure-ad-b2c-for-developers-and-architects/learn/lecture/34904062%3Fstart%3D45#overview',                    description: 'Azure AD for Developers course' },
    ],
  },
  {
    title: 'Learning',
    icon: '📚',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    links: [
      { label: '.NET Web API Boilerplate',     url: 'https://fullstackhero.net/dotnet-webapi-boilerplate/',                                                                      description: 'fullstackhero.net' },
      { label: 'ASP.NET Boilerplate',          url: 'https://aspnetboilerplate.com/',                                                                                            description: 'Open source web framework' },
      { label: 'Digital Transformation Sheet', url: 'https://docs.google.com/spreadsheets/d/1XrxqoZKVK29Ihq6cENc1n_fqJgo6d5HB1r1cxcqjy1Y/edit?gid=333165764#gid=333165764', description: 'Google Sheets' },
      { label: 'LMS',                          url: 'https://react-lms-10fe9.web.app/modern-learning-path/aERnCd7Kx5caWOtbh5dZ',                                                description: 'Learning Management System' },
    ],
  },
  {
    title: 'AI Tools',
    icon: '🤖',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    links: [
      { label: 'ChatGPT',  url: 'https://chatgpt.com/',                            description: 'OpenAI ChatGPT' },
      { label: 'Bolt.new', url: 'https://bolt.new/?trk=public_post_comment-text',  description: 'AI app builder' },
    ],
  },
  {
    title: 'Mail & Comms',
    icon: '📧',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    links: [
      { label: 'Gmail',   url: 'https://mail.google.com/mail/u/0/#inbox', description: 'Google Mail' },
      { label: 'Outlook', url: 'https://outlook.office.com/mail/',         description: 'Microsoft Outlook' },
    ],
  },
];

// Flat list of all links with their group info for search + favourites
const ALL_LINKS = LINK_GROUPS.flatMap((g) =>
  g.links.map((l) => ({ ...l, group: g.title, groupIcon: g.icon, color: g.color, bg: g.bg, border: g.border }))
);

type FlatLink = (typeof ALL_LINKS)[number];

function LinkCard({
  link,
  isFav,
  onToggleFav,
}: {
  link: FlatLink;
  isFav: boolean;
  onToggleFav: (url: string) => void;
}) {
  return (
    <div className={`group relative flex items-start gap-3 bg-white rounded-xl border-2 ${link.border} hover:shadow-md hover:-translate-y-0.5 transition-all p-4`}>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 flex-1 min-w-0"
      >
        <div className={`w-8 h-8 rounded-lg ${link.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <FiExternalLink className={`w-4 h-4 ${link.color}`} />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors">
            {link.label}
          </p>
          {link.description && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{link.description}</p>
          )}
          <p className="text-[10px] text-gray-300 mt-1 font-mono truncate">
            {link.url.replace(/^https?:\/\//, '').split('/')[0]}
          </p>
        </div>
      </a>
      {/* Favourite star */}
      <button
        onClick={() => onToggleFav(link.url)}
        title={isFav ? 'Remove from favourites' : 'Add to favourites'}
        className={`absolute top-3 right-3 transition-colors ${isFav ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-400'}`}
      >
        <FiStar className={`w-4 h-4 ${isFav ? 'fill-yellow-400' : ''}`} />
      </button>
    </div>
  );
}

export default function LinksPage() {
  const [query, setQuery] = useState('');
  const [favUrls, setFavUrls] = useState<Set<string>>(new Set());

  // Load favourites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('link_favourites');
      if (stored) setFavUrls(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  const toggleFav = (url: string) => {
    setFavUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      try { localStorage.setItem('link_favourites', JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  };

  const q = query.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!q) return [];
    return ALL_LINKS.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q) ||
        l.group.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q)
    );
  }, [q]);

  const favourites = useMemo(
    () => ALL_LINKS.filter((l) => favUrls.has(l.url)),
    [favUrls]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quick Links</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">All important links in one place.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search links…"
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search results */}
      {q && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 w-fit">
            <FiSearch className="w-4 h-4 text-gray-500" />
            <h2 className="font-bold text-sm text-gray-600">
              Results for &quot;{query}&quot; ({searchResults.length})
            </h2>
          </div>
          {searchResults.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No links found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchResults.map((link) => (
                <LinkCard key={link.url} link={link} isFav={favUrls.has(link.url)} onToggleFav={toggleFav} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Favourites section */}
      {!q && favourites.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-200 w-fit">
            <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            <h2 className="font-bold text-sm text-yellow-700">Favourites ({favourites.length})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favourites.map((link) => (
              <LinkCard key={link.url} link={link} isFav={true} onToggleFav={toggleFav} />
            ))}
          </div>
        </section>
      )}

      {/* All groups (hidden when searching) */}
      {!q && LINK_GROUPS.map((group) => (
        <section key={group.title}>
          <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl ${group.bg} border ${group.border} w-fit`}>
            <span className="text-lg">{group.icon}</span>
            <h2 className={`font-bold text-sm ${group.color}`}>{group.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.links.map((link) => {
              const flat = ALL_LINKS.find((l) => l.url === link.url)!;
              return (
                <LinkCard key={link.url} link={flat} isFav={favUrls.has(link.url)} onToggleFav={toggleFav} />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
