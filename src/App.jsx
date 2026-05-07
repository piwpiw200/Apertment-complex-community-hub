import { useMemo, useState } from 'react';

const ADMIN_EMAIL = 'admin@community.com';

const initialResidents = [
  {
    id: 1,
    name: 'Emma Rivera',
    email: 'emma@home.com',
    phone: '(555) 012-3456',
    occupation: 'Student',
    about: 'Loves rooftop yoga and gardening with neighbors.',
    avatar: 'ER',
    role: 'resident',
    memberType: 'Student',
    approved: true,
    joined: 'Mar 2025',
  },
  {
    id: 2,
    name: 'Noah Chen',
    email: 'noah@home.com',
    phone: '(555) 023-7890',
    occupation: 'Office Worker',
    about: 'Enjoys community potlucks and building local connections.',
    avatar: 'NC',
    role: 'resident',
    memberType: 'Office Worker',
    approved: true,
    joined: 'Jan 2025',
  },
  {
    id: 3,
    name: 'Priya Patel',
    email: 'priya@home.com',
    phone: '(555) 045-6721',
    occupation: 'Teacher',
    about: 'Helps organize study groups and kid-friendly events.',
    avatar: 'PP',
    role: 'resident',
    memberType: 'Teacher',
    approved: true,
    joined: 'Feb 2025',
  },
];

const initialEvents = [
  {
    id: 1,
    title: 'Poolside Yoga',
    date: 'May 15',
    description: 'Relaxing sunset yoga by the pool.',
    participants: ['Emma Rivera'],
    interested: ['Noah Chen'],
    notInterested: [],
  },
  {
    id: 2,
    title: 'Community Potluck',
    date: 'May 22',
    description: 'Bring a dish and meet neighbors.',
    participants: ['Noah Chen'],
    interested: ['Emma Rivera'],
    notInterested: [],
  },
];

const initialMeetings = [];

const initialPosts = [
  {
    id: 1,
    author: 'Emma Rivera',
    type: 'photo',
    caption: 'Shared the new rooftop garden view!',
    time: '2h ago',
    reactions: { like: 5, love: 2, angry: 0, vomit: 0, sorrow: 0, crazy: 1, thumbsUp: 3, thumbsDown: 0 },
    comments: [
      { id: 1, author: 'Noah Chen', text: 'Looks amazing!', time: '1h ago' },
      { id: 2, author: 'Priya Patel', text: 'Can\'t wait to visit!', time: '30m ago' },
    ],
  },
  {
    id: 2,
    author: 'Noah Chen',
    type: 'video',
    caption: 'Walkthrough of the renovated lounge.',
    time: '5h ago',
    reactions: { like: 3, love: 1, angry: 0, vomit: 0, sorrow: 0, crazy: 0, thumbsUp: 2, thumbsDown: 0 },
    comments: [],
  },
];

const initialIssues = [
  {
    id: 1,
    reporter: 'Priya Patel',
    subject: 'Elevator humming after 10pm',
    detail: 'The elevator keeps humming loudly after 10pm and needs inspection.',
    status: 'Open',
    feedback: '',
    type: 'Maintenance',
    created: 'May 4',
  },
];

const initialMessages = [
  {
    id: 1,
    from: 'Emma Rivera',
    to: 'Noah Chen',
    body: 'Hey Noah, are you joining the potluck?',
    time: 'Just now',
  },
  {
    id: 2,
    from: 'Noah Chen',
    to: 'Emma Rivera',
    body: 'Yes! I’ll bring dessert.',
    time: '2m ago',
  },
  {
    id: 3,
    from: 'Admin',
    to: 'Group',
    body: 'Reminder: event sign-up closes tomorrow.',
    time: '1h ago',
  },
];

const tabs = [
  { id: 'explore', label: 'Explore' },
  { id: 'feed', label: 'Community Feed' },
  { id: 'events', label: 'Events' },
  { id: 'meetings', label: 'Meetings' },
  { id: 'chat', label: 'Chat' },
  { id: 'issues', label: 'Issues' },
  { id: 'admin', label: 'Admin Panel' },
];

const issueStatusTabs = ['All', 'Open', 'Pending', 'Resolved'];

function avatarStyle(name) {
  const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-violet-500', 'bg-orange-500', 'bg-slate-500'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function App() {
  const [users, setUsers] = useState(initialResidents);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('explore');
  const [events, setEvents] = useState(initialEvents);
  const [meetings, setMeetings] = useState(initialMeetings);
  const [posts, setPosts] = useState(initialPosts);
  const [issues, setIssues] = useState(initialIssues);
  const [messages, setMessages] = useState(initialMessages);
  const [loginEmail, setLoginEmail] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerOccupation, setRegisterOccupation] = useState('');
  const [registerAbout, setRegisterAbout] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [newPostMediaPreview, setNewPostMediaPreview] = useState(null);
  const [newPostMediaType, setNewPostMediaType] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [issueSubject, setIssueSubject] = useState('');
  const [issueDetail, setIssueDetail] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState('Group');
  const [chatBody, setChatBody] = useState('');
  const [issueFilter, setIssueFilter] = useState('All');
  const [adminFeedback, setAdminFeedback] = useState('');
  const [newComments, setNewComments] = useState({});

  const residentOptions = useMemo(
    () => users.filter((user) => user.role === 'resident' && user.approved),
    [users]
  );

  const contacts = useMemo(() => {
    const contactsList = [
      { id: 'Group', name: 'Community Group', type: 'group', avatar: 'G' },
      ...residentOptions
        .filter((user) => user.name !== currentUser?.name)
        .map((user) => ({
          id: user.name,
          name: user.name,
          type: 'person',
          avatar: user.avatar,
        })),
    ];
    if (currentUser?.role !== 'admin') {
      contactsList.push({ id: 'Admin', name: 'Admin', type: 'person', avatar: 'AD' });
    }
    return contactsList;
  }, [residentOptions, currentUser]);

  const filteredContacts = useMemo(
    () => contacts.filter((contact) => contact.name.toLowerCase().includes(contactSearch.toLowerCase())),
    [contacts, contactSearch]
  );

  // এই অংশে চ্যাট চরিত্রগুলি প্রস্তুত করা হয়।
  // currentUser নাল হলে এখানে ফাঁকা অ্যারে ফেরত দিবে, তাই লগআউটের সময় ব্ল্যাংক স্ক্রিন হবে না।
  const activeConversation = useMemo(() => {
    if (!currentUser) return [];
    return messages
      .filter((msg) => {
        if (selectedContact === 'Group') {
          return msg.to === 'Group' || msg.from === 'Group';
        }
        return (
          (msg.from === currentUser.name && msg.to === selectedContact) ||
          (msg.from === selectedContact && msg.to === currentUser.name)
        );
      })
      .sort((a, b) => a.id - b.id);
  }, [messages, selectedContact, currentUser]);

  // রিসেন্ট চ্যাট নিয়ে আসার সময় currentUser না থাকলে খালি অ্যারে দিবে।
  const recentChats = useMemo(() => {
    if (!currentUser) return [];
    const seen = new Set();
    const items = [];
    [...messages].reverse().forEach((msg) => {
      const other = msg.to === 'Group' ? 'Group' : msg.from === currentUser.name ? msg.to : msg.from;
      if (!seen.has(other) && items.length < 6) {
        seen.add(other);
        items.push({ name: other, lastMessage: msg.body, time: msg.time });
      }
    });
    return items;
  }, [messages, currentUser]);

  const unreadRequests = pendingUsers.length;
  const allPeople = [...users, ...pendingUsers];

  const handleLogin = (event) => {
    event.preventDefault();
    if (loginEmail.toLowerCase() === ADMIN_EMAIL) {
      setCurrentUser({
        id: 0,
        name: 'Admin',
        email: ADMIN_EMAIL,
        phone: '(555) 000-0000',
        occupation: 'Community Manager',
        about: 'Oversees tenant approvals, events, and issue resolution.',
        avatar: 'AD',
        role: 'admin',
        memberType: 'Admin',
        approved: true,
        joined: 'Jan 2025',
      });
      setIsAdmin(true);
      setActiveTab('admin');
      return;
    }

    const resident = users.find(
      (user) => user.email.toLowerCase() === loginEmail.toLowerCase() && user.approved
    );
    if (resident) {
      setCurrentUser(resident);
      setIsAdmin(false);
      setActiveTab('explore');
    } else {
      alert('Resident not found or not approved yet. Use the request form if you are new.');
    }
  };

  const handleRegister = (event) => {
    event.preventDefault();
    if (!registerName || !registerEmail || !registerPhone || !registerOccupation) {
      return alert('Please provide name, email, phone, and occupation.');
    }
    const alreadyExists = allPeople.some((user) => user.email.toLowerCase() === registerEmail.toLowerCase());
    if (alreadyExists) {
      return alert('Email already exists or is pending approval.');
    }

    const newApplicant = {
      id: Date.now(),
      name: registerName,
      email: registerEmail,
      phone: registerPhone,
      occupation: registerOccupation,
      about: registerAbout || 'New resident joining the community.',
      avatar: registerName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      role: 'resident',
      memberType: registerOccupation,
      approved: false,
      joined: 'Pending',
    };
    setPendingUsers([newApplicant, ...pendingUsers]);
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPhone('');
    setRegisterOccupation('');
    setRegisterAbout('');
    alert('Account created. Waiting for admin approval.');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setActiveTab('explore');
    setLoginEmail('');
    setSelectedContact('Group');
  };

  const handleCreatePost = (event) => {
    event.preventDefault();
    if (!currentUser) return;
    if (!newPostCaption.trim() && !newPostMedia) return;
    const newPost = {
      id: Date.now(),
      author: currentUser.name,
      type: newPostMediaType || 'text',
      caption: newPostCaption,
      time: 'Just now',
      media: newPostMediaPreview,
      mediaName: newPostMedia?.name || '',
      reactions: { like: 0, love: 0, angry: 0, vomit: 0, sorrow: 0, crazy: 0, thumbsUp: 0, thumbsDown: 0 },
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setNewPostCaption('');
    setNewPostMedia(null);
    setNewPostMediaPreview(null);
    setNewPostMediaType('');
  };

  const handleAddReaction = (postId, reactionType) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, reactions: { ...post.reactions, [reactionType]: post.reactions[reactionType] + 1 } }
        : post
    ));
  };

  const handleDeletePost = (postId) => {
    if (!currentUser) return;
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleAddComment = (postId, event) => {
    event.preventDefault();
    const commentText = newComments[postId]?.trim();
    if (!commentText || !currentUser) return;
    const newComment = {
      id: Date.now(),
      author: currentUser.name,
      text: commentText,
      time: 'Just now',
    };
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
    setNewComments({ ...newComments, [postId]: '' });
  };

  const handleDeleteComment = (postId, commentId) => {
    if (!currentUser) return;
    setPosts(posts.map((post) =>
      post.id === postId
        ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
        : post
    ));
  };

  const handleSharePost = (postId) => {
    alert('Share link copied to clipboard! (Simulated)');
  };

  const handleTerminateEvent = (eventId) => {
    if (!isAdmin) return;
    const terminated = events.find((event) => event.id === eventId);
    setEvents(events.filter((event) => event.id !== eventId));
    if (terminated) {
      setMessages([
        {
          id: Date.now() + 1,
          from: 'Admin',
          to: 'Group',
          body: `Event terminated: ${terminated.title}. It has been removed from the schedule.`,
          time: 'Just now',
        },
        ...messages,
      ]);
    }
  };

  const handleCreateEvent = (event) => {
    event.preventDefault();
    if (!eventTitle.trim()) return;
    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      date: 'Upcoming',
      description: 'New community event launched by admin.',
      participants: [],
      interested: [],
      notInterested: [],
    };
    setEvents([newEvent, ...events]);
    setEventTitle('');
    setMessages([
      {
        id: Date.now() + 1,
        from: 'Admin',
        to: 'Group',
        body: `New event created: ${newEvent.title}. Click Explore to see details.`,
        time: 'Just now',
      },
      ...messages,
    ]);
  };

  // এই ফাংশনটি নতুন মিটিং শিডিউল করার জন্য।
  // এখানে গুগল মিট লিঙ্ক, তারিখ, ডেসক্রিপশন সহ মিটিং তৈরি হয়।
  const handleScheduleMeeting = (event) => {
    event.preventDefault();
    if (!meetingTitle.trim() || !meetingDate.trim() || !meetingLink.trim() || !meetingDescription.trim()) {
      return alert('Please provide meeting title, date/time, description, and Google Meet link.');
    }
    const newMeeting = {
      id: Date.now(),
      title: meetingTitle,
      date: meetingDate,
      description: meetingDescription,
      live: false,
      link: meetingLink,
      attendees: [],
    };
    setMeetings([newMeeting, ...meetings]);
    setMeetingTitle('');
    setMeetingDate('');
    setMeetingLink('');
    setMeetingDescription('');
    setMessages([
      {
        id: Date.now() + 1,
        from: 'Admin',
        to: 'Group',
        body: `Meeting scheduled: ${newMeeting.title} on ${newMeeting.date}. Join via the meeting tab.`,
        time: 'Just now',
      },
      ...messages,
    ]);
  };

  // এই ফাংশনটি শিডিউল করা মিটিংকে লাইভ স্ট্যাটাস দেয়,
  // এবং গ্রুপ চ্যাটে রিমাইন্ডার মেসেজ পাঠায়।
  const handleLaunchMeetingNow = (meetingId) => {
    setMeetings(
      meetings.map((meeting) =>
        meeting.id === meetingId ? { ...meeting, live: true, date: 'Now' } : meeting
      )
    );
    const launched = meetings.find((meeting) => meeting.id === meetingId);
    if (launched) {
      setMessages([
        {
          id: Date.now() + 1,
          from: 'Admin',
          to: 'Group',
          body: `Live meeting started: ${launched.title}. Join now from Meetings.`,
          time: 'Just now',
        },
        ...messages,
      ]);
    }
  };

  const handleReportIssue = (event) => {
    event.preventDefault();
    if (!issueSubject.trim() || !issueDetail.trim() || !currentUser) return;
    const newIssue = {
      id: Date.now(),
      reporter: currentUser.name,
      subject: issueSubject,
      detail: issueDetail,
      status: 'Open',
      feedback: '',
      type: 'Resident Request',
      created: 'Today',
    };
    setIssues([newIssue, ...issues]);
    setIssueSubject('');
    setIssueDetail('');
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!chatBody.trim() || !currentUser) return;
    const to = selectedContact === 'Group' ? 'Group' : selectedContact;
    const newMessage = {
      id: Date.now(),
      from: currentUser.name,
      to,
      body: chatBody,
      time: 'Just now',
    };
    setMessages([newMessage, ...messages]);
    setChatBody('');
  };

  const handleApproveResident = (userId) => {
    const approvedUser = pendingUsers.find((user) => user.id === userId);
    if (!approvedUser) return;
    setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
    setUsers([{ ...approvedUser, approved: true, joined: 'May 2026' }, ...users]);
  };

  const handleJoinEvent = (eventId) => {
    if (!currentUser) return;
    setEvents(
      events.map((item) =>
        item.id === eventId
          ? {
              ...item,
              participants: item.participants.includes(currentUser.name)
                ? item.participants
                : [...item.participants, currentUser.name],
            }
          : item
      )
    );
  };

  const handleEventInterest = (eventId, interested) => {
    if (!currentUser) return;
    setEvents(
      events.map((item) =>
        item.id === eventId
          ? {
              ...item,
              interested: interested
                ? Array.from(new Set([...item.interested, currentUser.name]))
                : item.interested.filter((name) => name !== currentUser.name),
              notInterested: !interested
                ? Array.from(new Set([...item.notInterested, currentUser.name]))
                : item.notInterested.filter((name) => name !== currentUser.name),
            }
          : item
      )
    );
  };

  const handleAttendMeeting = (meetingId) => {
    if (!currentUser) return;
    setMeetings(
      meetings.map((meeting) =>
        meeting.id === meetingId
          ? {
              ...meeting,
              attendees: meeting.attendees.includes(currentUser.name)
                ? meeting.attendees
                : [...meeting.attendees, currentUser.name],
            }
          : meeting
      )
    );
  };

  const handleUpdateIssue = (issueId, status) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId ? { ...issue, status, feedback: adminFeedback || issue.feedback } : issue
      )
    );
    setAdminFeedback('');
  };

  const adminVisibleIssues = useMemo(
    () =>
      issues.filter((issue) => issueFilter === 'All' || issue.status === issueFilter),
    [issues, issueFilter]
  );

  const residentIssues = useMemo(
    () => issues.filter((issue) => issue.reporter === currentUser?.name),
    [issues, currentUser]
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
            <div className="p-10 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
              <div className="mb-8">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 011.414 1.414L2 12.414V19a1 1 0 001 1h3a1 1 0 001-1v-3h2v3a1 1 0 001 1h3a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
                  </svg>
                  <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Apartment Community</p>
                </div>
                <h1 className="mt-4 text-4xl font-semibold">Resident portal for your building.</h1>
              </div>
              <p className="text-slate-300 leading-relaxed">
                A community dashboard inspired by social networking and meeting tools. Residents request accounts, post updates, join events, chat, and report issues. Admins approve registrations, manage events, and resolve issues.
              </p>
              <div className="mt-8 space-y-3 text-sm text-slate-300">
                <p>Admin login address: <span className="font-semibold text-white">{ADMIN_EMAIL}</span></p>
                <p>Resident examples: <span className="font-semibold text-white">emma@home.com</span>, <span className="font-semibold text-white">noah@home.com</span></p>
                <p>Register with name, email, phone, occupation, and a short bio.</p>
              </div>
            </div>
            <div className="p-10">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
                  <form onSubmit={handleLogin} className="mt-6 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your registered email"
                    />
                    <button className="w-full rounded-3xl bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-500 transition">
                      Continue
                    </button>
                  </form>
                </div>
                <div className="rounded-3xl border border-slate-200 p-6">
                  <h2 className="text-2xl font-semibold text-slate-900">Request resident access</h2>
                  <form onSubmit={handleRegister} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Full name"
                      />
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Email address"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="tel"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        className="rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Mobile number"
                      />
                      <input
                        type="text"
                        value={registerOccupation}
                        onChange={(e) => setRegisterOccupation(e.target.value)}
                        className="rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Occupation (e.g. teacher, plumber)"
                      />
                    </div>
                    <textarea
                      value={registerAbout}
                      onChange={(e) => setRegisterAbout(e.target.value)}
                      rows="4"
                      className="w-full rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="About you and your apartment role"
                    />
                    <button className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-white font-semibold hover:bg-slate-700 transition">
                      Request approval
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userProfile = (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-4">
        <div className={`flex h-16 w-16 items-center justify-center rounded-3xl text-xl font-semibold text-white ${avatarStyle(currentUser.name)}`}>
          {currentUser.avatar}
        </div>
        <div>
          <p className="text-sm text-slate-500">{isAdmin ? 'Admin' : 'Resident'}</p>
          <h3 className="text-xl font-semibold">{currentUser.name}</h3>
          <p className="text-sm text-slate-500">{currentUser.occupation}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3 text-sm text-slate-600">
        <p>{currentUser.about}</p>
        <p><span className="font-semibold text-slate-900">Email:</span> {currentUser.email}</p>
        <p><span className="font-semibold text-slate-900">Phone:</span> {currentUser.phone}</p>
        <p><span className="font-semibold text-slate-900">Member:</span> {currentUser.memberType}</p>
        <p><span className="font-semibold text-slate-900">Joined:</span> {currentUser.joined}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 011.414 1.414L2 12.414V19a1 1 0 001 1h3a1 1 0 001-1v-3h2v3a1 1 0 001 1h3a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
              </svg>
              <p className="text-sm uppercase tracking-[0.4em] text-indigo-600">Apartment Community</p>
            </div>
            <h1 className="text-2xl font-semibold">Hello, {currentUser.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium">{isAdmin ? 'Admin' : 'Resident'}</span>
            <button onClick={handleLogout} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Dashboard</p>
              <h2 className="text-3xl font-semibold">Community hub</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => {
                if (tab.id === 'admin' && !isAdmin) return null;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {activeTab === 'explore' && (
          <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-slate-500">Explore</p>
                    <h3 className="text-2xl font-semibold">Neighborhood activity and resident stories</h3>
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{users.length} residents</div>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Active posts</p>
                    <p className="mt-3 text-3xl font-semibold">{posts.length}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Open issues</p>
                    <p className="mt-3 text-3xl font-semibold">{issues.filter((issue) => issue.status === 'Open').length}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Upcoming events</p>
                    <p className="mt-3 text-3xl font-semibold">{events.length}</p>
                  </div>
                </div>
              </div>
              {events.length > 0 && (
                <div className="rounded-3xl bg-indigo-50 p-6 shadow-sm ring-1 ring-indigo-200">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700">Event spotlight</p>
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xl font-semibold">{events[0].title}</p>
                      <p className="mt-2 text-sm text-slate-600">{events[0].date} · {events[0].description}</p>
                    </div>
                    <button
                      onClick={() => handleJoinEvent(events[0].id)}
                      className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 transition"
                    >
                      {events[0].participants.includes(currentUser?.name) ? 'Joined' : 'Join event'}
                    </button>
                  </div>
                </div>
              )}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-xl font-semibold">Community highlights</h3>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-3xl border border-slate-200 p-4">
                      <p className="font-semibold">Rooftop garden update</p>
                      <p className="mt-2 text-sm text-slate-600">Neighbors are sharing photos from the new sunset garden.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 p-4">
                      <p className="font-semibold">New resident onboarding</p>
                      <p className="mt-2 text-sm text-slate-600">A new member request is waiting admin approval.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 p-4">
                      <p className="font-semibold">Meeting prep</p>
                      <p className="mt-2 text-sm text-slate-600">A live building meeting can be launched from admin tools.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-xl font-semibold">Resident directory</h3>
                  <div className="mt-6 grid gap-4">
                    {residentOptions.slice(0, 4).map((resident) => (
                      <div key={resident.id} className="flex items-center gap-4 rounded-3xl border border-slate-200 p-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-3xl text-lg font-semibold text-white ${avatarStyle(resident.name)}`}>
                          {resident.avatar}
                        </div>
                        <div>
                          <p className="font-semibold">{resident.name}</p>
                          <p className="text-sm text-slate-500">{resident.occupation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <aside className="space-y-6">
              {userProfile}
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-xl font-semibold">Community moodboard</h3>
                <div className="mt-4 grid gap-3">
                  <div className="h-28 rounded-3xl bg-slate-100" />
                  <div className="h-28 rounded-3xl bg-slate-100" />
                </div>
              </div>
            </aside>
          </section>
        )}

        {activeTab === 'feed' && (
          <section className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-slate-500">Community Feed</p>
                    <h3 className="text-2xl font-semibold">Post updates like photos and videos</h3>
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{posts.length} shared items</div>
                </div>
                <form onSubmit={handleCreatePost} className="mt-6 space-y-4">
                  <textarea
                    value={newPostCaption}
                    onChange={(e) => setNewPostCaption(e.target.value)}
                    rows="4"
                    className="w-full rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Share a moment from the building, photo caption, or a quick video status..."
                  />
                  <div className="grid gap-4 sm:grid-cols-[0.4fr_0.6fr]">
                    <label className="flex items-center gap-3 rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 hover:border-sky-500 hover:text-indigo-700 transition cursor-pointer">
                      <span>Choose from gallery</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewPostMedia(file);
                            setNewPostMediaType(file.type.startsWith('video') ? 'video' : 'photo');
                            setNewPostMediaPreview(URL.createObjectURL(file));
                          } else {
                            setNewPostMedia(null);
                            setNewPostMediaType('');
                            setNewPostMediaPreview(null);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <button className="rounded-3xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-500 transition">
                      Share update
                    </button>
                  </div>
                  {newPostMediaPreview && (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      {newPostMediaType === 'photo' ? (
                        <img src={newPostMediaPreview} alt="Preview" className="max-h-64 w-full rounded-3xl object-cover" />
                      ) : (
                        <video controls src={newPostMediaPreview} className="max-h-64 w-full rounded-3xl" />
                      )}
                      <p className="mt-3 text-sm text-slate-600">Selected file: {newPostMedia?.name}</p>
                    </div>
                  )}
                </form>
              </div>
              <div className="space-y-5">
                {posts.map((post) => (
                  <article key={post.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">{post.author}</p>
                        <p className="text-sm text-slate-500">{post.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600">
                          {post.type}
                        </span>
                        {currentUser?.name === post.author && (
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs text-red-700 hover:bg-red-100 transition"
                          >
                            Delete post
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 rounded-3xl bg-slate-100 p-5 text-slate-600">
                      {post.media && post.type === 'photo' && (
                        <img src={post.media} alt={post.mediaName} className="w-full rounded-3xl object-cover" />
                      )}
                      {post.media && post.type === 'video' && (
                        <video controls src={post.media} className="w-full rounded-3xl" />
                      )}
                      <p className="mt-3">{post.caption}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button onClick={() => handleAddReaction(post.id, 'like')} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200 transition">
                        👍 {post.reactions.like}
                      </button>
                      <button onClick={() => handleAddReaction(post.id, 'love')} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200 transition">
                        ❤️ {post.reactions.love}
                      </button>
                      <button onClick={() => handleAddReaction(post.id, 'angry')} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200 transition">
                        😠 {post.reactions.angry}
                      </button>
                      <button onClick={() => handleAddReaction(post.id, 'vomit')} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200 transition">
                        🤮 {post.reactions.vomit}
                      </button>
                      <button onClick={() => handleAddReaction(post.id, 'sorrow')} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200 transition">
                        😢 {post.reactions.sorrow}
                      </button>
                      <button onClick={() => handleAddReaction(post.id, 'crazy')} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200 transition">
                        🤪 {post.reactions.crazy}
                      </button>
                      <button onClick={() => handleAddReaction(post.id, 'thumbsUp')} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200 transition">
                        👍 {post.reactions.thumbsUp}
                      </button>
                      <button onClick={() => handleAddReaction(post.id, 'thumbsDown')} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200 transition">
                        👎 {post.reactions.thumbsDown}
                      </button>
                      <button onClick={() => handleSharePost(post.id)} className="ml-auto rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-200 transition">
                        Share
                      </button>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-700">{post.comments.length} comments</p>
                      <div className="mt-2 space-y-2">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="rounded-2xl bg-slate-50 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold">{comment.author}</p>
                              {currentUser?.name === comment.author && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                  className="rounded-full border border-red-300 bg-red-50 px-2 py-1 text-[11px] text-red-700 hover:bg-red-100 transition"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{comment.text}</p>
                            <p className="text-xs text-slate-500">{comment.time}</p>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={(e) => handleAddComment(post.id, e)} className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={newComments[post.id] || ''}
                          onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}
                          className="flex-1 rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Add a comment..."
                        />
                        <button type="submit" className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 transition">
                          Post
                        </button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <aside className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-xl font-semibold">Resident statistics</h3>
                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="font-semibold">Active neighbors</p>
                    <p className="mt-2 text-sm text-slate-600">{residentOptions.length} approved residents in the community.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="font-semibold">Open issues</p>
                    <p className="mt-2 text-sm text-slate-600">{issues.filter((issue) => issue.status === 'Open').length} need admin review.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="font-semibold">Pending approvals</p>
                    <p className="mt-2 text-sm text-slate-600">{pendingUsers.length} resident requests awaiting admin action.</p>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        )}

        {activeTab === 'events' && (
          <section className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-slate-500">Events</p>
                    <h3 className="text-2xl font-semibold">Upcoming community gatherings</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{events.length} events</span>
                </div>
                <div className="mt-6 space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="rounded-3xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{event.title}</p>
                          <p className="text-sm text-slate-500">{event.date}</p>
                        </div>
                        <button
                          onClick={() => handleJoinEvent(event.id)}
                          className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 transition"
                        >
                          {event.participants.includes(currentUser.name) ? 'Joined' : 'Join'}
                        </button>
                      </div>
                      <p className="mt-3 text-slate-600">{event.description}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span>{event.participants.length} joined</span>
                        <span>{event.interested.length} interested</span>
                        <span>{event.notInterested.length} not interested</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEventInterest(event.id, true)}
                          className="rounded-full border border-sky-500 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 hover:bg-sky-100 transition"
                        >
                          Interested
                        </button>
                        <button
                          onClick={() => handleEventInterest(event.id, false)}
                          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                        >
                          Not interested
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleTerminateEvent(event.id)}
                            className="rounded-full border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100 transition"
                          >
                            Terminate event
                          </button>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-slate-500">{event.participants.length} residents joined</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <aside className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-xl font-semibold">Today’s event</h3>
                <p className="mt-4 text-sm text-slate-600">Check the feed or chat to coordinate who brings supplies and who arrives early.</p>
              </div>
            </aside>
          </section>
        )}

        {activeTab === 'meetings' && (
          <section className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-slate-500">Meetings</p>
                    <h3 className="text-2xl font-semibold">Live and planned sessions</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{meetings.length} sessions</span>
                </div>
                <div className="mt-6 space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="rounded-3xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{meeting.title}</p>
                          <p className="text-sm text-slate-500">{meeting.date}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meeting.live ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {meeting.live ? 'Live' : 'Scheduled'}
                        </span>
                      </div>
                      <p className="mt-3 text-slate-600">{meeting.description}</p>
                      {meeting.link && (
                        <p className="mt-3 text-sm text-slate-500">
                          Link: <a href={meeting.link} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:underline">{meeting.link}</a>
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {meeting.live && meeting.link ? (
                          <button
                            onClick={() => handleAttendMeeting(meeting.id)}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500 transition"
                          >
                            Attend Live
                          </button>
                        ) : meeting.link ? (
                          <a
                            href={meeting.link}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 transition"
                          >
                            View meeting link
                          </a>
                        ) : null}
                        {isAdmin && !meeting.live && (
                          <button
                            onClick={() => handleLaunchMeetingNow(meeting.id)}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                          >
                            Launch live now
                          </button>
                        )}
                      </div>
                      {meeting.attendees?.length > 0 && (
                        <p className="mt-3 text-sm text-slate-500">{meeting.attendees.length} attendees confirmed</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-xl font-semibold">Meeting notes</h3>
                <p className="mt-4 text-sm text-slate-600">Admins launch meetings and residents can see live sessions and agendas from here.</p>
              </aside>
            </div>
          </section>
        )}

        {activeTab === 'chat' && (
          <section className="grid gap-6 xl:grid-cols-[0.38fr_0.62fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-slate-500">Chat</p>
                    <h3 className="text-2xl font-semibold">Messenger style conversations</h3>
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{recentChats.length} recent threads</div>
                </div>
                <input
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="mt-6 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search residents or group chat"
                />
                <div className="mt-5 space-y-3">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact.id)}
                      className={`flex w-full items-center gap-3 rounded-3xl border px-4 py-4 text-left transition ${selectedContact === contact.id ? 'border-sky-500 bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-3xl text-lg font-semibold text-white ${avatarStyle(contact.name)}`}>
                        {contact.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-sm text-slate-500">{contact.type === 'group' ? 'Community group chat' : 'Direct message'}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Recent chats</p>
                  <div className="mt-4 space-y-3">
                    {recentChats.map((thread) => (
                      <div key={thread.name} className="rounded-3xl border border-slate-200 px-4 py-3">
                        <p className="font-semibold">{thread.name}</p>
                        <p className="text-sm text-slate-600 truncate">{thread.lastMessage}</p>
                        <p className="mt-1 text-xs text-slate-500">{thread.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-3xl text-lg font-semibold text-white ${avatarStyle(selectedContact)}`}>
                  {selectedContact === 'Group' ? 'G' : selectedContact.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-slate-500">{selectedContact === 'Group' ? 'Community Group' : selectedContact}</p>
                  <h4 className="text-xl font-semibold">{selectedContact === 'Group' ? 'General Community Chat' : selectedContact}</h4>
                </div>
              </div>
              <div className="mt-6 max-h-[44rem] space-y-4 overflow-auto pr-2">
                {activeConversation.length === 0 ? (
                  <p className="text-sm text-slate-500">No messages yet. Start the conversation below.</p>
                ) : (
                  activeConversation.map((message) => {
                    const isOwn = message.from === currentUser.name;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm ${isOwn ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                          <p className="font-medium">{message.from}</p>
                          <p className="mt-1">{message.body}</p>
                          <p className={`mt-2 text-xs ${isOwn ? 'text-sky-100' : 'text-slate-500'}`}>{message.time}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <form onSubmit={handleSendMessage} className="mt-6 space-y-4">
                <textarea
                  value={chatBody}
                  onChange={(e) => setChatBody(e.target.value)}
                  rows="4"
                  className="w-full rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type a message..."
                />
                <button className="rounded-3xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-500 transition">
                  Send message
                </button>
              </form>
            </div>
          </section>
        )}

        {activeTab === 'issues' && (
          <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
            <div className="space-y-6">
              {isAdmin ? (
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-slate-500">Issue center</p>
                      <h3 className="text-2xl font-semibold">Resident reports and feedback</h3>
                    </div>
                    <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                      {issueStatusTabs.map((status) => (
                        <button
                          key={status}
                          onClick={() => setIssueFilter(status)}
                          className={`rounded-full px-3 py-1 transition ${issueFilter === status ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {adminVisibleIssues.map((issue) => (
                      <div key={issue.id} className="rounded-3xl border border-slate-200 p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{issue.subject}</p>
                            <p className="text-sm text-slate-500">{issue.reporter} · {issue.created}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            issue.status === 'Open'
                              ? 'bg-rose-100 text-rose-700'
                              : issue.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {issue.status}
                          </span>
                        </div>
                        <p className="mt-3 text-slate-600">{issue.detail}</p>
                        <p className="mt-3 text-sm text-slate-500">Type: {issue.type}</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <button
                            onClick={() => handleUpdateIssue(issue.id, 'Open')}
                            className="rounded-2xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
                          >
                            Mark Open
                          </button>
                          <button
                            onClick={() => handleUpdateIssue(issue.id, 'Pending')}
                            className="rounded-2xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
                          >
                            Mark Pending
                          </button>
                          <button
                            onClick={() => handleUpdateIssue(issue.id, 'Resolved')}
                            className="rounded-2xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
                          >
                            Mark Resolved
                          </button>
                        </div>
                        <textarea
                          value={adminFeedback}
                          onChange={(e) => setAdminFeedback(e.target.value)}
                          rows="3"
                          className="mt-4 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Add feedback for the resident"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <div>
                    <p className="text-slate-500">Report an issue</p>
                    <h3 className="text-2xl font-semibold">Send a concern to admin</h3>
                  </div>
                  <form onSubmit={handleReportIssue} className="mt-6 space-y-4">
                    <input
                      type="text"
                      value={issueSubject}
                      onChange={(e) => setIssueSubject(e.target.value)}
                      className="w-full rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Issue summary"
                    />
                    <textarea
                      value={issueDetail}
                      onChange={(e) => setIssueDetail(e.target.value)}
                      rows="5"
                      className="w-full rounded-3xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Describe the problem in detail"
                    />
                    <button className="rounded-3xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-500 transition">
                      Submit issue
                    </button>
                  </form>
                  <div className="mt-6 space-y-4">
                    {residentIssues.map((issue) => (
                      <div key={issue.id} className="rounded-3xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-semibold">{issue.subject}</p>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            issue.status === 'Open'
                              ? 'bg-rose-100 text-rose-700'
                              : issue.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {issue.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{issue.detail}</p>
                        {issue.feedback && (
                          <p className="mt-2 text-sm text-slate-500">Feedback: {issue.feedback}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <aside className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-xl font-semibold">Issue summary</h3>
                <div className="mt-4 space-y-3 text-slate-600">
                  <p>Open: {issues.filter((issue) => issue.status === 'Open').length}</p>
                  <p>Pending: {issues.filter((issue) => issue.status === 'Pending').length}</p>
                  <p>Resolved: {issues.filter((issue) => issue.status === 'Resolved').length}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-xl font-semibold">Need help?</h3>
                <p className="mt-3 text-sm text-slate-600">Only approved residents can lodge issues. Admins can update the status and leave feedback once reviewed.</p>
              </div>
            </aside>
          </section>
        )}

        {activeTab === 'admin' && isAdmin && (
          <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-slate-500">Admin panel</p>
                    <h3 className="text-2xl font-semibold">Manage approvals and community operations</h3>
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{pendingUsers.length} pending approvals</div>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <form onSubmit={handleCreateEvent} className="space-y-4 rounded-3xl border border-slate-200 p-4">
                    <p className="font-semibold">Create Event</p>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Event title"
                    />
                    <button className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-500 transition">
                      Add Event
                    </button>
                  </form>
                  <form onSubmit={handleScheduleMeeting} className="space-y-4 rounded-3xl border border-slate-200 p-4">
                    <p className="font-semibold">Schedule Meeting</p>
                    <input
                      type="text"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Meeting title"
                    />
                    <input
                      type="text"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Date / time (e.g. May 28, 7PM)"
                    />
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Google Meet link (admin must provide)"
                    />
                    <textarea
                      value={meetingDescription}
                      onChange={(e) => setMeetingDescription(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Meeting description / agenda (admin must provide)"
                    />
                    <button className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-500 transition">
                      Schedule Meeting
                    </button>
                  </form>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-xl font-semibold">Account approvals</h3>
                {pendingUsers.length === 0 ? (
                  <p className="mt-4 text-slate-600">No pending requests at the moment.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {pendingUsers.map((pending) => (
                      <div key={pending.id} className="rounded-3xl border border-slate-200 p-4">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-3xl text-lg font-semibold text-white ${avatarStyle(pending.name)}`}>
                            {pending.avatar}
                          </div>
                          <div>
                            <p className="font-semibold">{pending.name}</p>
                            <p className="text-sm text-slate-500">{pending.occupation}</p>
                            <p className="text-sm text-slate-500">{pending.phone}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-slate-600">{pending.about}</p>
                        <button
                          onClick={() => handleApproveResident(pending.id)}
                          className="mt-4 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500 transition"
                        >
                          Approve resident
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <aside className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-xl font-semibold">Admin summary</h3>
                <div className="mt-4 space-y-3 text-slate-600">
                  <p>Approved residents: {users.length}</p>
                  <p>Pending approvals: {pendingUsers.length}</p>
                  <p>Events active: {events.length}</p>
                  <p>Open issues: {issues.filter((issue) => issue.status === 'Open').length}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-xl font-semibold">Admin guidance</h3>
                <p className="mt-3 text-sm text-slate-600">Approve new residents, resolve resident issues, and keep the community feed active.</p>
              </div>
            </aside>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
