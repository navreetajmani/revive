'use client'

import Image from 'next/image'
import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react'

import {
  createCommunityPostAction,
  loginAction,
  logoutAction,
  saveJourneyAction,
  signUpAction,
} from '@/app/(frontend)/actions'
import {
  defaultReviveData,
  type CommunityPostView,
  type GardenReward,
  type PauseState,
  type ReviveData,
  type WeeklyPlan,
} from '@/lib/revive-types'

type IconName =
  | 'arrow'
  | 'back'
  | 'book'
  | 'camera'
  | 'check'
  | 'chevron'
  | 'clock'
  | 'close'
  | 'companion'
  | 'community'
  | 'cook'
  | 'craft'
  | 'dance'
  | 'edit'
  | 'game'
  | 'garden'
  | 'home'
  | 'leaf'
  | 'music'
  | 'outdoor'
  | 'palette'
  | 'plus'
  | 'profile'
  | 'spark'
  | 'sport'

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    camera: <><path d="M14.5 5 13 3H8L6.5 5H3v15h18V5z" /><circle cx="12" cy="12" r="4" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    close: <><path d="m7 7 10 10M17 7 7 17" /></>,
    companion: <><path d="M7 11V8a5 5 0 0 1 10 0v3M5 15a7 7 0 0 0 14 0v-4H5z" /><path d="M9 14h.01M15 14h.01M10 17c1.3 1 2.7 1 4 0" /></>,
    community: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2" /><path d="M3 20a6 6 0 0 1 12 0M14 16a4.5 4.5 0 0 1 7 3.7" /></>,
    cook: <><path d="M6 10c-3-3 1-6 3-4 1-4 6-3 6 0 4-1 5 4 2 6v7H7v-7" /><path d="M7 15h10" /></>,
    craft: <><circle cx="8" cy="8" r="3" /><circle cx="8" cy="16" r="3" /><path d="m10 10 9 9M10 14l9-9" /></>,
    dance: <><circle cx="13" cy="4" r="2" /><path d="m9 21 2-7-3-4 5-3 3 4 4 1M11 14l5 5" /></>,
    edit: <><path d="m4 20 4.5-1L19 8.5 15.5 5 5 15.5zM13.5 7l3.5 3.5" /></>,
    game: <><path d="M7 8h10a5 5 0 0 1 4.5 7.2l-1.2 2.4a2 2 0 0 1-3.3.4l-2-2H9l-2 2a2 2 0 0 1-3.3-.4l-1.2-2.4A5 5 0 0 1 7 8Z" /><path d="M7 11v4M5 13h4M16 12h.01M19 14h.01" /></>,
    garden: <><path d="M12 21V10M12 14c-5 0-7-3-7-7 5 0 7 3 7 7ZM12 11c0-5 3-7 7-7 0 5-3 7-7 7Z" /></>,
    home: <><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z" /></>,
    leaf: <><path d="M20 4C11 4 5 8 5 15c0 2 1 4 3 5 0-7 5-10 10-13-4 4-7 8-8 13 6 0 10-5 10-16Z" /></>,
    music: <><path d="M9 18V5l10-2v13M9 10l10-2" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
    outdoor: <><path d="m3 20 6-10 3 5 3-6 6 11z" /><path d="M16 5h.01M4 20h17" /></>,
    palette: <><path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h5a4 4 0 0 0 4-4c0-3.5-4-6-9-6Z" /><path d="M7.5 9h.01M10 6.5h.01M15 7h.01" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    spark: <><path d="M12 2c.5 5 2 7 7 7-5 .5-7 2-7 7-.5-5-2-7-7-7 5-.5 7-2 7-7ZM19 16c.2 2 1 2.8 3 3-2 .2-2.8 1-3 3-.2-2-1-2.8-3-3 2-.2 2.8-1 3-3Z" /></>,
    sport: <><circle cx="12" cy="12" r="9" /><path d="m8 5 4 3 4-3M3 11l5 3-1 5M21 11l-5 3 1 5M8 14h8" /></>,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const hobbies = [
  ['Art & Drawing', 'palette'], ['Music & Instruments', 'music'], ['Sports & Fitness', 'sport'],
  ['Reading & Writing', 'book'], ['Dance', 'dance'], ['Photography', 'camera'],
  ['Cooking & Baking', 'cook'], ['Gardening', 'garden'], ['Crafting & DIY', 'craft'],
  ['Gaming', 'game'], ['Outdoor Activities', 'outdoor'], ['Other', 'plus'],
] as [string, IconName][]

const feelingOptions = [
  'Excited to get back into it', 'Nervous about starting again', "I feel like I've lost my skills",
  "I don't know where to begin", "I worry I won't stay consistent",
  'I feel overwhelmed thinking about it', 'I miss how it used to make me feel',
]
const changeOptions = [
  'Lack of time', 'Academic or professional commitments', 'Lost motivation',
  'Financial constraints', 'Lack of access to resources', 'Physical or environmental circumstances',
  'Lost touch with people I used to do it with', 'Life circumstances changed',
  'I simply grew out of it', 'Other',
]
const barrierOptions = [
  'Finding time in my schedule', 'Getting back to my previous skill level',
  'Finding the motivation to begin', 'Not knowing how to restart',
  'Finding people to do it with', 'Finding the right equipment or resources',
  'Being afraid of giving up again',
]
const timeOptions = ['Within the last week', 'Within the last month', '1–6 months ago', '6–12 months ago', 'More than a year ago', "I can't remember"]
const companions = [
  { type: 'dog', label: 'Dog', trait: 'Bright & loyal', color: '#E7A968' },
  { type: 'cat', label: 'Cat', trait: 'Calm & curious', color: '#F5DD69' },
  { type: 'duck', label: 'Duck', trait: 'Sunny & brave', color: '#F4D95E' },
  { type: 'frog', label: 'Frog', trait: 'Easygoing & kind', color: '#8FCB78' },
]
const companionColors = [
  ['Sunshine', '#F5DD69'], ['Tangerine', '#E99B65'], ['Meadow', '#8FCB78'],
  ['Sky', '#8DB9DE'], ['Lilac', '#C5A9DD'], ['Cocoa', '#B8886B'],
]
const companionPatterns = ['Plain', 'Spots', 'Patch']

type Data = ReviveData

function Companion({ type = 'cat', size = 120, color, pattern = 'Plain' }: { type?: string; size?: number; color?: string; pattern?: string }) {
  const item = companions.find(c => c.type === type) || companions[0]
  const ear = type === 'frog' ? 'frog' : type === 'duck' ? 'flat' : type === 'dog' ? 'flop' : 'point'
  return (
    <div className={`pet pet-${ear} pet-${type} pattern-${pattern.toLowerCase()}`} style={{ width: size, height: size, '--pet': color || item.color } as React.CSSProperties}>
      <span className="pet-ear left" /><span className="pet-ear right" />
      <span className="pet-face">
        <i className="eye left" /><i className="eye right" /><i className="nose" />
        <i className="smile" />
        <i className="pet-spot spot-one" /><i className="pet-spot spot-two" />
        {type === 'duck' && <i className="duck-beak" />}
      </span>
      <span className="pet-body" />
      <span className="pet-star"><Icon name="spark" size={16} /></span>
    </div>
  )
}

function Logo({ small = false }: { small?: boolean }) {
  return <div className={`logo ${small ? 'logo-small' : ''}`}><span className="logo-mark"><Icon name="leaf" size={small ? 17 : 21} /></span><span>revive</span></div>
}

function Button({ children, onClick, disabled, secondary = false, type = 'button' }: { children: ReactNode; onClick?: () => void; disabled?: boolean; secondary?: boolean; type?: 'button' | 'submit' }) {
  return <button type={type} className={`primary-button ${secondary ? 'secondary-button' : ''}`} onClick={onClick} disabled={disabled}><span>{children}</span>{!secondary && <Icon name="arrow" size={19} />}</button>
}

function Progress({ step }: { step: number }) {
  const percent = Math.max(5, ((step - 1) / 11) * 100)
  return <div className="progress-wrap"><div className="progress-label"><span>Your story</span><span>{Math.max(1, step - 1)} of 11</span></div><div className="progress"><span style={{ width: `${percent}%` }} /></div></div>
}

function OnboardingShell({ step, title, eyebrow, children, onBack, footer, compact = false }: { step: number; title: string; eyebrow?: string; children: ReactNode; onBack: () => void; footer?: ReactNode; compact?: boolean }) {
  return (
    <div className="screen onboarding-screen">
      <header className="topbar">
        <button className="icon-button" onClick={onBack} aria-label="Go back"><Icon name="back" /></button>
        <Logo small />
        <span className="topbar-spacer" />
      </header>
      <Progress step={step} />
      <main className={`screen-content ${compact ? 'compact' : ''}`}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {children}
      </main>
      {footer && <footer className="sticky-footer">{footer}</footer>}
    </div>
  )
}

function MultiOptions({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (option: string) => onChange(value.includes(option) ? value.filter(v => v !== option) : [...value, option])
  return <div className="option-list">{options.map(option => <button key={option} className={`option-row ${value.includes(option) ? 'selected' : ''}`} onClick={() => toggle(option)}><span>{option}</span><i>{value.includes(option) && <Icon name="check" size={16} />}</i></button>)}</div>
}

function Welcome({ onNext, onLogin }: { onNext: () => void; onLogin: () => void }) {
  return (
    <div className="screen welcome">
      <div className="welcome-glow" />
      <header><Logo /></header>
      <main>
        <div className="hero-art" aria-hidden="true">
          <div className="sun-ring"><Icon name="spark" size={28} /></div>
          <div className="hobby-orbit orbit-one"><Icon name="palette" size={23} /></div>
          <div className="hobby-orbit orbit-two"><Icon name="music" size={22} /></div>
          <div className="hobby-orbit orbit-three"><Icon name="book" size={22} /></div>
          <div className="path-line" />
          <div className="hero-plant"><span /><span /><i /></div>
        </div>
        <p className="eyebrow">Welcome to Revive</p>
        <h1>Find your way back to what you love.</h1>
        <p className="lead">Life gets busy. Interests change. Sometimes we lose touch with the things that once made us happy. Revive helps you rediscover them, one small step at a time.</p>
      </main>
      <footer>
        <Button onClick={onNext}>Let's begin</Button>
        <button className="text-button" onClick={onLogin}>I already have an account</button>
      </footer>
    </div>
  )
}

function Reassurance({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="screen reassurance">
      <header className="topbar"><button className="icon-button" onClick={onBack}><Icon name="back" /></button><Logo small /><span className="topbar-spacer" /></header>
      <main>
        <div className="reassure-art"><div className="yellow-circle"><Icon name="leaf" size={48} /></div><span className="float-spark one"><Icon name="spark" /></span><span className="float-spark two"><Icon name="spark" size={16} /></span></div>
        <p className="eyebrow">A gentle reminder</p>
        <h1>It's okay if you haven't done it in a while.</h1>
        <p className="lead">Your hobbies don't have an expiry date. You haven't failed, and you don't need to pick up exactly where you left off. We're here to help you find your way back.</p>
        <blockquote>“You don't have to start where you left off. You just have to start again.”</blockquote>
      </main>
      <footer><Button onClick={onNext}>Get started</Button></footer>
    </div>
  )
}

function HobbiesStep({ data, setData, next, back }: StepProps) {
  const [custom, setCustom] = useState('')
  const toggle = (h: string) => setData({ ...data, hobbies: data.hobbies.includes(h) ? data.hobbies.filter(x => x !== h) : [...data.hobbies, h] })
  const addCustom = () => {
    if (custom.trim() && !data.hobbies.includes(custom.trim())) setData({ ...data, hobbies: [...data.hobbies.filter(h => h !== 'Other'), custom.trim()] })
    setCustom('')
  }
  return <OnboardingShell step={3} title="What hobbies are you naturally drawn towards?" eyebrow="Let's get to know you better" onBack={back} footer={<Button onClick={next} disabled={!data.hobbies.length}>Continue</Button>}>
    <p className="support">Choose as many as feel like you. There are no wrong answers.</p>
    <div className="hobby-grid">{hobbies.map(([h, icon]) => <button className={`hobby-choice ${data.hobbies.includes(h) ? 'selected' : ''}`} key={h} onClick={() => toggle(h)}><span className="hobby-icon"><Icon name={icon} /></span><span>{h}</span>{data.hobbies.includes(h) && <i><Icon name="check" size={13} /></i>}</button>)}</div>
    {data.hobbies.includes('Other') && <div className="inline-input"><input autoFocus value={custom} onChange={e => setCustom(e.target.value)} placeholder="Type your hobby" onKeyDown={e => e.key === 'Enter' && addCustom()} /><button onClick={addCustom}>Add</button></div>}
  </OnboardingShell>
}

type StepProps = { data: Data; setData: (data: Data) => void; next: () => void; back: () => void }

function PreviousStep({ data, setData, next, back }: StepProps) {
  const [custom, setCustom] = useState('')
  const choices = data.hobbies.filter(h => h !== 'Other')
  return <OnboardingShell step={4} title="What hobbies have been part of your story?" eyebrow="Looking back, gently" onBack={back} footer={<Button onClick={next} disabled={!data.previous.length}>Continue</Button>}>
    <p className="support">Select things you've practised, tried briefly, or always wanted to explore.</p>
    <div className="tag-cloud">{choices.map(h => <button key={h} onClick={() => setData({ ...data, previous: data.previous.includes(h) ? data.previous.filter(x => x !== h) : [...data.previous, h] })} className={data.previous.includes(h) ? 'selected' : ''}><Icon name="check" size={15} />{h}</button>)}</div>
    <div className="section-label"><span>Anything else?</span></div>
    <div className="inline-input"><input value={custom} onChange={e => setCustom(e.target.value)} placeholder="Add another hobby" /><button onClick={() => { if (custom.trim()) setData({ ...data, previous: [...data.previous, custom.trim()] }); setCustom('') }}>Add</button></div>
  </OnboardingShell>
}

function LastTimeStep({ data, setData, next, back }: StepProps) {
  const mainHobby = data.previous[0] || data.hobbies[0]
  return <OnboardingShell step={5} title="When was the last time you did this?" eyebrow={mainHobby ? `Thinking about ${mainHobby}` : 'A little reflection'} onBack={back} footer={<Button onClick={next} disabled={!data.lastTime}>Continue</Button>}>
    <div className="conversation-card"><span><Icon name="clock" size={20} /></span><p>Take your best guess. This isn't a test, and “I can't remember” is a perfectly good answer.</p></div>
    <div className="radio-list">{timeOptions.map(t => <button key={t} className={data.lastTime === t ? 'selected' : ''} onClick={() => setData({ ...data, lastTime: t })}><i>{data.lastTime === t && <span />}</i><span>{t}</span></button>)}</div>
  </OnboardingShell>
}

function FeelingsStep({ data, setData, next, back }: StepProps) {
  return <OnboardingShell step={6} title="How do you feel when you think about restarting?" eyebrow="However you feel is welcome" onBack={back} footer={<Button onClick={next} disabled={!data.feelings.length}>Continue</Button>}>
    <p className="support">You can choose more than one. Mixed feelings are completely normal.</p>
    <MultiOptions options={feelingOptions} value={data.feelings} onChange={feelings => setData({ ...data, feelings })} />
    <label className="field-label">Want to tell us a little more?<textarea value={data.notes} onChange={e => setData({ ...data, notes: e.target.value })} placeholder="Optional — share only what feels comfortable" /></label>
  </OnboardingShell>
}

function GenericMultiStep({ data, setData, next, back, kind }: StepProps & { kind: 'changes' | 'barriers' }) {
  const changes = kind === 'changes'
  const value = changes ? data.changes : data.barriers
  return <OnboardingShell step={changes ? 7 : 8} title={changes ? 'What changed, and why did you stop?' : "What's the hardest part about starting again?"} eyebrow={changes ? 'Life changes — and that is okay' : 'Let’s make the first step lighter'} onBack={back} footer={<Button onClick={next} disabled={!value.length}>Continue</Button>}>
    <p className="support">{changes ? 'Stopping is not a failure. Help us understand what got in the way so we can support you better.' : 'Choose anything that feels true. We’ll shape your plan around what you need.'}</p>
    <MultiOptions options={changes ? changeOptions : barrierOptions} value={value} onChange={v => setData({ ...data, [kind]: v })} />
    {changes && <label className="field-label">Anything else you'd like us to know?<textarea placeholder="Optional context" /></label>}
  </OnboardingShell>
}

function ScheduleStep({ data, setData, next, back }: StepProps) {
  const times = ['Weekdays', 'Weekends', 'Mornings', 'Afternoons', 'Evenings']
  const frequencies = ['Once a week', 'Twice a week', 'Three times a week', 'Four or more times a week', "I'm not sure yet"]
  return <OnboardingShell step={9} title="Let's find a little space for what you love." eyebrow="Your week, your pace" onBack={back} footer={<Button onClick={next} disabled={!data.availability.length || !data.frequency}>Continue</Button>}>
    <p className="question-label">When might a little hobby time fit naturally?</p>
    <div className="schedule-grid">{times.map(t => <button key={t} className={data.availability.includes(t) ? 'selected' : ''} onClick={() => setData({ ...data, availability: data.availability.includes(t) ? data.availability.filter(x => x !== t) : [...data.availability, t] })}><span><Icon name={t === 'Evenings' ? 'spark' : 'clock'} size={19} /></span>{t}<i>{data.availability.includes(t) && <Icon name="check" size={13} />}</i></button>)}</div>
    <p className="question-label second">How many times a week feels realistic?</p>
    <div className="pill-list">{frequencies.map(f => <button key={f} className={data.frequency === f ? 'selected' : ''} onClick={() => setData({ ...data, frequency: f })}>{f}</button>)}</div>
    <div className="encouragement"><Icon name="spark" size={19} /><p><strong>Small steps count.</strong> You don't need to do everything at once. Even one session is a meaningful beginning.</p></div>
  </OnboardingShell>
}

function CompanionStep({ data, setData, next, back }: StepProps) {
  const selected = companions.find(c => c.type === data.companion)!
  return <OnboardingShell step={10} title="Meet your new little companion." eyebrow="A friend for the journey" onBack={back} footer={<Button onClick={next}>Meet my companion</Button>}>
    <p className="support">Choose a companion who will grow alongside you — with encouragement, never pressure.</p>
    <div className="selected-pet-card"><Companion type={selected.type} size={126} color={data.companionColor} pattern={data.companionPattern} /><div><span>Your companion</span><strong>{data.companionName || selected.label}</strong><small>{selected.trait}</small></div></div>
    <p className="customize-label">Choose an animal</p>
    <div className="pet-picker">{companions.map(c => <button key={c.type} className={data.companion === c.type ? 'selected' : ''} onClick={() => setData({ ...data, companion: c.type })}><Companion type={c.type} size={58} /><span>{c.label}</span></button>)}</div>
    <p className="customize-label">Pick their color</p>
    <div className="color-picker">{companionColors.map(([name, value]) => <button key={value} aria-label={name} title={name} className={data.companionColor === value ? 'selected' : ''} style={{ background: value }} onClick={() => setData({ ...data, companionColor: value })}>{data.companionColor === value && <Icon name="check" size={15} />}</button>)}</div>
    <p className="customize-label">Add some markings</p>
    <div className="pattern-picker">{companionPatterns.map(pattern => <button key={pattern} className={data.companionPattern === pattern ? 'selected' : ''} onClick={() => setData({ ...data, companionPattern: pattern })}><i className={`pattern-swatch pattern-${pattern.toLowerCase()}`} />{pattern}</button>)}</div>
    <label className="field-label">What would you like to call them?<input value={data.companionName} onChange={e => setData({ ...data, companionName: e.target.value })} placeholder="Companion name" /></label>
  </OnboardingShell>
}

function NotificationsStep({ data, setData, next, back }: StepProps) {
  const settings = data.notificationSettings
  return <OnboardingShell step={11} title="Would you like a little reminder?" eyebrow="Gentle nudges, on your terms" onBack={back} footer={<Button onClick={next}>Finish setting up</Button>}>
    <p className="support">Reminders can help create a little space in busy weeks. Turn any of them off whenever you like.</p>
    <div className="notification-list">{Object.entries(settings).map(([key, on], i) => <div className="notification-row" key={key}><span className="notification-icon"><Icon name={i === 2 ? 'companion' : i === 3 ? 'spark' : 'clock'} size={21} /></span><div><strong>{key}</strong><small>{['Before a planned hobby moment', 'A gentle Sunday reflection', `A kind note from ${'your companion'}`, 'Celebrate participation, not streaks'][i]}</small></div><button aria-label={`Toggle ${key}`} className={`toggle ${on ? 'on' : ''}`} onClick={() => setData({ ...data, notificationSettings: { ...settings, [key]: !on } })}><i /></button></div>)}</div>
    <button className="not-now" onClick={next}>Maybe later</button>
  </OnboardingShell>
}

function AuthScreen({ data, setData, finish, back, initialLogin = false }: StepProps & { finish: () => void; initialLogin?: boolean }) {
  const [login, setLogin] = useState(initialLogin)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!login && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setPending(true)
    setError('')
    const result = login
      ? await loginAction(email, password)
      : await signUpAction(email, password, data.name, data)
    setPending(false)
    if (!result.ok) {
      setError(result.message || 'Something went wrong. Please try again.')
      return
    }
    if (result.data) setData(result.data)
    finish()
  }
  return <div className="screen auth-screen">
    <header className="topbar"><button className="icon-button" onClick={back}><Icon name="back" /></button><Logo small /><span className="topbar-spacer" /></header>
    <main><div className="auth-heading"><span><Icon name="spark" size={24} /></span><p className="eyebrow">{login ? 'Welcome back' : 'One last little step'}</p><h1>{login ? 'Good to see you again.' : 'Your journey starts here.'}</h1><p>{login ? 'Pick up gently, right where you are.' : 'Save your story and keep your companion close.'}</p></div>
      <form onSubmit={submit}>
        {!login && <label>Full name<input required value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="What should we call you?" /></label>}
        <label>Email address<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
        <label>Password<input required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" /></label>
        {!login && <label>Confirm password<input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Type your password again" /></label>}
        {login && <button type="button" className="forgot">Forgot password?</button>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <Button type="submit" disabled={pending}>{pending ? 'Saving…' : login ? 'Log in' : 'Create my account'}</Button>
      </form>
      <div className="or"><span />or<span /></div>
      <button className="google-button"><b>G</b> Continue with Google</button>
      <p className="auth-switch">{login ? "New to Revive?" : 'Already have an account?'} <button onClick={() => setLogin(!login)}>{login ? 'Create an account' : 'Log in'}</button></p>
    </main>
  </div>
}

function BottomNav({ tab, setTab }: { tab: string; setTab: (tab: string) => void }) {
  const items: [string, IconName][] = [['Companion', 'companion'], ['My Hobbies', 'leaf'], ['Home', 'home'], ['Feed', 'spark'], ['Community', 'community']]
  return <nav className="bottom-nav">{items.map(([label, icon]) => <button className={tab === label ? 'active' : ''} key={label} onClick={() => setTab(label)}><Icon name={icon} size={22} /><span>{label}</span></button>)}</nav>
}

function AppHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <header className="app-header"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</header>
}

type Project = { title: string; desc: string; duration: string; stage: 'Rediscover' | 'Rebuild' | 'Explore' | 'Create'; difficulty: string }

const artTitles = [
  'Meet your materials again', 'Paint soft clouds', 'Mix a sunset sky', 'Sketch simple objects', 'Make a color mood card',
  'Build a three-color gradient', 'Paint light and shadow', 'Add distant mountains', 'Create trees and texture', 'Repaint an old favorite',
  'Try a limited palette', 'Paint reflections in water', 'Explore expressive brushwork', 'Compose a quiet still life', 'Paint from a photograph',
  'Design an original scene', 'Paint a complete landscape', 'Create a personal color story', 'Build a three-piece series', 'Create your signature artwork',
]
const genericTitles = ['Reconnect with the basics', 'A ten-minute warm-up', 'Revisit an old favorite', 'Practice one core skill', 'Finish a tiny project', 'Build confidence with repetition', 'Learn a useful technique', 'Follow a guided mini project', 'Combine two familiar skills', 'Recreate something you admire', 'Try a different style', 'Work from a new prompt', 'Add your own variation', 'Make something for a friend', 'Complete a weekend project', 'Plan an original idea', 'Create with a personal theme', 'Complete an ambitious project', 'Build a small collection', 'Make your signature project']
const stages: Project['stage'][] = ['Rediscover', 'Rebuild', 'Explore', 'Create']
function getProjectPath(hobby: string): Project[] {
  const titles = hobby.includes('Art') || hobby.includes('Drawing') ? artTitles : genericTitles
  return titles.map((title, i) => ({
    title,
    desc: i < 5 ? 'A gentle way to reconnect with familiar foundations.' : i < 10 ? 'Build confidence through a focused, achievable project.' : i < 15 ? 'Explore a fresh technique and make it your own.' : 'Bring your growing skills into a personal finished piece.',
    duration: `${15 + (i % 5) * 10} min`,
    stage: stages[Math.floor(i / 5)],
    difficulty: i < 5 ? 'Easy' : i < 10 ? 'Growing' : i < 15 ? 'Intermediate' : 'Advanced',
  }))
}

function hobbyImage(hobby: string) {
  if (hobby.includes('Music')) return '/images/guitar.jpg'
  if (hobby.includes('Garden')) return '/images/garden.jpg'
  if (hobby.includes('Craft')) return '/images/botanical.jpg'
  if (hobby.includes('Photo')) return '/images/photography.jpg'
  if (hobby.includes('Cook')) return '/images/baking.jpg'
  if (hobby.includes('Dance')) return '/images/dance.jpg'
  return '/images/watercolor.jpg'
}

function gardenStage(data: Data) {
  const growth=data.gardenRewards.length+Object.values(data.hobbyProgress).reduce((a,b)=>a+b,0)*2
  return growth<5?{number:1,name:'A New Beginning',next:5-growth}:growth<12?{number:2,name:'Taking Root',next:12-growth}:growth<25?{number:3,name:'Flourishing',next:25-growth}:{number:4,name:'Thriving',next:0}
}

function Home({ data, setData, setTab, plans, setPlans, pause, setPause, onPause }: { data: Data; setData:(d:Data)=>void; setTab: (t: string) => void; plans: Record<string, WeeklyPlan>; setPlans: (p: Record<string, WeeklyPlan>) => void; pause: PauseState; setPause: (p: PauseState) => void; onPause: () => void }) {
  const activeHobbies = data.hobbies.length ? data.hobbies : ['Art & Drawing', 'Music & Instruments']
  const [editing, setEditing] = useState<string | null>(null)
  const [sessionVisible, setSessionVisible] = useState(true)
  const [sessionTime, setSessionTime] = useState('Saturday, 10:30 AM')
  const completedProjects = Object.values(data.hobbyProgress).reduce((a, b) => a + b, 0)
  const main = activeHobbies[0]
  const current = getProjectPath(main)[Math.min(data.hobbyProgress[main] || 0, 19)]
  const stage=gardenStage(data)
  const returnEarly=()=>{setPause({...pause,active:false});setData({...data,gardenRewards:[...data.gardenRewards,{id:`welcome-${Date.now()}`,type:'welcome',label:'Welcome-back flower',source:'Returning to Revive',date:new Date().toLocaleDateString()}]})}
  if (pause.active) return <div className="tab-screen paused-home"><AppHeader title={`Take your time, ${data.name}.`} subtitle="Your journey is paused. Nothing has been lost." /><div className="paused-hero"><Companion type={data.companion} size={118} color={data.companionColor} pattern={data.companionPattern} /><span>PAUSED WITH CARE</span><h2>Your break is officially yours.</h2><p>We'll gently check in on <strong>{pause.returnDate}</strong>. Until then, your progress and Milo's garden are safe.</p></div><section className="return-project"><Image src={hobbyImage(pause.hobby)} alt="" width={64} height={64} /><div><small>WAITING FOR YOUR RETURN</small><strong>{pause.project}</strong><span>{pause.hobby}</span></div></section><button className="resume-button" onClick={returnEarly}>I'm ready to come back early</button><label className="change-date">Change my return date<input type="date" value={pause.returnDate} onChange={e => setPause({ ...pause, returnDate:e.target.value })} /></label><p className="paused-note">Normal reminders and weekly targets are suspended. Garden growth is preserved.</p></div>
  return <div className="tab-screen home-screen"><AppHeader title={`Hey, ${data.name || 'Navreet'}!`} subtitle="Ready to make a little time for what you love?" />
    <div className="home-feature-grid">
      <button className="pause-square" onClick={onPause}><span className="pause-symbol"><i/><i/></span><strong>Pause</strong><p>It's okay to take a break.</p><small>Pause my journey <Icon name="arrow" size={13}/></small></button>
      <button className="garden-square" onClick={()=>setTab('Garden')}><div className="mini-garden"><span className="mini-tree"/><span className="mini-flower f1"/><span className="mini-flower f2"/><Companion type={data.companion} size={73} color={data.companionColor} pattern={data.companionPattern}/></div><strong>Milo's Garden</strong><p>Look how much we've grown! · {stage.name}</p><small>Visit garden <Icon name="arrow" size={13}/></small></button>
    </div>
    <section className="companion-banner"><div className="speech"><span>{data.companionName || 'Milo'} says</span><p>“You've been making space for yourself lately. How are you feeling about your progress?”</p><button onClick={() => setTab('Companion')}>Check in <Icon name="arrow" size={15} /></button></div><Companion type={data.companion} size={112} color={data.companionColor} pattern={data.companionPattern} /></section>
    <div className="section-heading"><div><span>YOUR WEEK, YOUR WAY</span><h2>Flexible plans for real life</h2></div></div>
    <div className="weekly-plans">{activeHobbies.map((h,i) => { const plan=plans[h] || {count:2,days:['Wed','Sat'],time:'Evening',enabled:true}; return <button key={h} onClick={() => setEditing(h)} className={!plan.enabled?'disabled':''}><span className={`plan-icon hobby-color-${i%3}`}><Icon name={(hobbies.find(x=>x[0]===h)?.[1]||'leaf') as IconName}/></span><div><strong>{h}</strong><small>{plan.enabled ? `${plan.count} sessions · ${plan.days.join(', ')} · ${plan.time}` : 'Scheduling paused'}</small><i><b style={{width:plan.enabled?`${Math.min(100,50/plan.count)}%`:'0%'}} /></i></div><Icon name="edit" size={17}/></button>})}</div>
    <div className="section-heading"><div><span>A WEEK WORTH NOTICING</span><h2>Your activity</h2></div></div>
    <div className="stat-grid"><div><strong>3</strong><span>sessions enjoyed</span></div><div><strong>1h 25m</strong><span>time for yourself</span></div><div><strong>{completedProjects}</strong><span>projects completed</span></div><div><strong>{activeHobbies.length}</strong><span>active hobbies</span></div></div>
    {sessionVisible && <section className="next-session"><div className="session-date"><strong>22</strong><span>JUN</span></div><div><span>UPCOMING SESSION</span><h3>{current.title}</h3><p><Icon name="clock" size={14}/> {sessionTime} · {current.duration}</p></div><div className="session-actions"><button onClick={() => setSessionTime(sessionTime.startsWith('Saturday')?'Sunday, 4:00 PM':'Saturday, 10:30 AM')} aria-label="Reschedule session"><Icon name="edit" size={16}/></button><button onClick={() => setSessionVisible(false)} aria-label="Cancel session"><Icon name="close" size={16}/></button></div></section>}
    <section className="continue-card"><Image src={hobbyImage(main)} alt="" width={105} height={137} /><div><small>CONTINUE WHERE YOU LEFT OFF</small><h3>{current.title}</h3><p>{main} · {current.stage}</p><div><i style={{width:'42%'}} /></div><button onClick={() => setTab('My Hobbies')}>Continue <Icon name="arrow" size={14}/></button></div></section>
    {editing && <div className="modal-backdrop" onClick={()=>setEditing(null)}><div className="sheet plan-sheet" onClick={e=>e.stopPropagation()}><div className="sheet-handle"/><p className="eyebrow">EDIT WEEKLY RHYTHM</p><h2>{editing}</h2>{(()=>{const p=plans[editing]||{count:2,days:['Wed','Sat'],time:'Evening',enabled:true}; return <><div className="count-control"><span>Sessions per week</span><div><button onClick={()=>setPlans({...plans,[editing]:{...p,count:Math.max(1,p.count-1)}})}>-</button><strong>{p.count}</strong><button onClick={()=>setPlans({...plans,[editing]:{...p,count:Math.min(7,p.count+1)}})}>+</button></div></div><p className="sheet-label">Preferred days</p><div className="day-picker">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><button className={p.days.includes(d)?'selected':''} onClick={()=>setPlans({...plans,[editing]:{...p,days:p.days.includes(d)?p.days.filter(x=>x!==d):[...p.days,d]}})} key={d}>{d[0]}</button>)}</div><p className="sheet-label">Preferred time</p><div className="pill-list">{['Morning','Afternoon','Evening'].map(t=><button className={p.time===t?'selected':''} onClick={()=>setPlans({...plans,[editing]:{...p,time:t}})} key={t}>{t}</button>)}</div><button className={`schedule-toggle ${!p.enabled?'off':''}`} onClick={()=>setPlans({...plans,[editing]:{...p,enabled:!p.enabled}})}>{p.enabled?'Temporarily pause this schedule':'Turn this schedule back on'}</button><Button onClick={()=>setEditing(null)}>Save changes</Button></>})()}</div></div>}
  </div>
}

function HobbiesTab({ data, setData, onGarden }: { data: Data; setData: (d: Data) => void; onGarden:()=>void }) {
  const [detail, setDetail] = useState<string | null>(null)
  const [assessing, setAssessing] = useState<string | null>(null)
  const [capabilities, setCapabilities] = useState<number[]>([])
  const [adding, setAdding] = useState(false)
  const [newHobby, setNewHobby] = useState('')
  const [rewardNotice,setRewardNotice]=useState<GardenReward|null>(null)
  const openHobby = (hobby: string) => {
    if (data.hobbyLevels[hobby] === undefined) {
      setCapabilities([])
      setAssessing(hobby)
    } else setDetail(hobby)
  }
  if (assessing) {
    const projects = getProjectPath(assessing)
    const checks = projects.slice(0, 3)
    return <div className="tab-screen assessment-screen">
      <button className="back-link" onClick={() => setAssessing(null)}><Icon name="back" /> My hobbies</button>
      <div className="assessment-intro"><span><Icon name={(hobbies.find(h => h[0] === assessing)?.[1] || 'leaf') as IconName} size={30} /></span><p className="eyebrow">A quick capability check</p><h1>Let's find your best starting point.</h1><p>Tell us what you've made before. This is only to skip anything that would feel too easy — there are no scores.</p></div>
      <div className="capability-list">{checks.map((project, i) => <button key={project.title} className={capabilities.includes(i) ? 'selected' : ''} onClick={() => setCapabilities(capabilities.includes(i) ? capabilities.filter(x => x !== i) : [...capabilities, i])}><i>{capabilities.includes(i) && <Icon name="check" size={15} />}</i><span><strong>I've completed something like</strong><small>{project.title}</small></span></button>)}</div>
      <div className="assessment-note"><Icon name="spark" size={18} /><p>We'll mark familiar projects as complete and open the next useful challenge for you.</p></div>
      <Button onClick={() => {
        const completed = capabilities.length
        setData({ ...data, hobbyLevels: { ...data.hobbyLevels, [assessing]: completed }, hobbyProgress: { ...data.hobbyProgress, [assessing]: completed } })
        setDetail(assessing)
        setAssessing(null)
      }}>Build my project path</Button>
    </div>
  }
  if (detail) {
    const projects = getProjectPath(detail)
    const completed = data.hobbyProgress[detail] || 0
    const checkpoint = data.projectCheckpoints[detail] || 0
    const growGarden=()=>{
      const completing=checkpoint===4
      const types:GardenReward['type'][]=['seed','sprout','flower','bush']
      const type:GardenReward['type']=completing?(completed>=14?'special':'tree'):types[checkpoint]
      const labels:Record<GardenReward['type'],string>={seed:'A new seed',sprout:'A hopeful sprout',flower:'A seasonal flower',bush:'A flowering bush',tree:completed%3===0?'Cherry blossom tree':'Young fruit tree',special:'Milestone willow tree',welcome:'Welcome-back flower'}
      const reward={id:`${detail}-${completed}-${checkpoint}-${Date.now()}`,plantKey:`${detail}-${completed}`,type,label:labels[type],source:`${projects[Math.min(completed,19)].title} · ${completing?'Project completed':`Checkpoint ${checkpoint+1}`}`,date:new Date().toLocaleDateString()}
      setData({...data,projectCheckpoints:{...data.projectCheckpoints,[detail]:completing?0:checkpoint+1},hobbyProgress:completing?{...data.hobbyProgress,[detail]:Math.min(projects.length,completed+1)}:data.hobbyProgress,gardenRewards:[...data.gardenRewards,reward]})
      setRewardNotice(reward)
    }
    return <div className="tab-screen detail-screen project-detail">
      <button className="back-link" onClick={() => setDetail(null)}><Icon name="back" /> My hobbies</button>
      <div className="detail-hero"><span><Icon name={(hobbies.find(h => h[0] === detail)?.[1] || 'leaf') as IconName} size={38} /></span><p>Your personal path</p><h1>{detail}</h1><small>{projects[Math.min(completed,19)].stage} · Level {Math.min(completed + 1, projects.length)} · {completed} of 20 projects</small><div className="hobby-actions"><button onClick={()=>{setCapabilities([]);setAssessing(detail);setDetail(null)}}>Retake assessment</button><button onClick={()=>{setData({...data,hobbies:data.hobbies.filter(h=>h!==detail)});setDetail(null)}}>Remove hobby</button></div></div>
      <div className="path-progress"><i style={{ width: `${Math.max(8, (completed / projects.length) * 100)}%` }} /></div>
      <div className="project-path">{projects.map((project, i) => {
        const done = i < completed
        const current = i === completed
        return <div key={project.title} className="project-stage-wrap">{i%5===0&&<div className="stage-label"><span>{project.stage}</span><small>{i+1}–{i+5}</small></div>}<div className={`project-step ${done ? 'done' : current ? 'current' : 'locked'}`}><span className="path-node">{done ? <Icon name="check" size={15} /> : i + 1}</span><div><small>{done ? 'COMPLETED' : current ? 'UP NEXT' : `UNLOCKS AFTER PROJECT ${i}`}</small><h3>{project.title}</h3><p>{project.desc}</p><span><Icon name="clock" size={13} /> {project.duration} · {project.difficulty}</span>{current&&<div className="checkpoint-row">{[0,1,2,3,4].map(c=><i className={c<checkpoint?'done':c===checkpoint?'current':''} key={c}/>)}</div>}{current && <button onClick={growGarden}>{checkpoint===4?'Complete project & grow a tree':`Complete checkpoint ${checkpoint+1} of 5`} <Icon name="leaf" size={14} /></button>}</div></div></div>
      })}</div>
      {completed === projects.length && <div className="path-complete"><Icon name="spark" /><p><strong>Path complete, not journey complete.</strong><br />You can revisit any project or keep exploring in your own way.</p></div>}
      {rewardNotice&&<div className="reward-overlay"><div className="reward-pop"><button onClick={()=>setRewardNotice(null)}><Icon name="close"/></button><div className={`reward-plant ${rewardNotice.type}`}><i/><span/></div><p className="eyebrow">LOOK! SOMETHING IS GROWING</p><h2>{rewardNotice.label}</h2><p>{rewardNotice.source} helped this grow in Milo's garden.</p><div><button onClick={()=>setRewardNotice(null)}>Keep learning</button><button onClick={onGarden}>Visit garden</button></div></div></div>}
    </div>
  }
  return <div className="tab-screen hobbies-tab"><AppHeader title="My hobbies" subtitle="Choose a hobby to find your personal starting point." action={<button className="round-add" onClick={() => setAdding(true)}><Icon name="plus" /></button>} />
    <div className="mini-summary"><span><Icon name="leaf" /></span><p><strong>{data.hobbies.length || 2} hobbies</strong><small>Each one gets a path shaped around your experience</small></p></div>
    <div className="hobby-list">{(data.hobbies.length ? data.hobbies : ['Art & Drawing', 'Reading & Writing']).map((h,i) => {
      const assessed = data.hobbyLevels[h] !== undefined
      const completed = data.hobbyProgress[h] || 0
      const path=getProjectPath(h)
      return <button key={h} onClick={() => openHobby(h)}><Image className="hobby-cover" src={hobbyImage(h)} alt="" width={70} height={70} /><div><h3>{h}</h3><p>{assessed ? `${path[Math.min(completed,19)].stage} · ${completed}/20 complete` : 'Start with a gentle capability check'}</p><small>{assessed ? `Next: ${path[Math.min(completed,19)].title}` : 'We’ll find your best starting point'}</small><div className="tiny-progress"><i style={{ width: assessed ? `${Math.max(5, completed * 5)}%` : '0%' }} /></div></div><Icon name="chevron" /></button>
    })}</div>
    <button className="add-hobby-card" onClick={() => setAdding(true)}><span><Icon name="plus" /></span><div><strong>Add another hobby</strong><small>Something new, or an old favourite</small></div></button>
    {adding && <div className="modal-backdrop" onClick={() => setAdding(false)}><div className="sheet" onClick={e => e.stopPropagation()}><div className="sheet-handle" /><button className="sheet-close" onClick={() => setAdding(false)}><Icon name="close" /></button><p className="eyebrow">A new possibility</p><h2>What would you like to explore?</h2><label className="field-label">Hobby name<input autoFocus value={newHobby} onChange={e => setNewHobby(e.target.value)} placeholder="e.g. Pottery" /></label><Button disabled={!newHobby.trim()} onClick={() => { setData({ ...data, hobbies: [...data.hobbies, newHobby.trim()] }); setAdding(false); setNewHobby('') }}>Add to my hobbies</Button></div></div>}
  </div>
}

function GardenScreen({ data, onBack }: { data:Data; onBack:()=>void }) {
  const stage=gardenStage(data)
  const [selected,setSelected]=useState<GardenReward|null>(null)
  const [miloHappy,setMiloHappy]=useState(false)
  const starter:GardenReward={id:'starter',type:'flower',label:'First garden flower',source:'Beginning your Revive journey',date:'Your first day'}
  const rewards=[starter,...data.gardenRewards]
  const visualRewards=rewards.filter((reward,index)=>!reward.plantKey||!rewards.slice(index+1).some(item=>item.plantKey===reward.plantKey))
  return <div className="tab-screen garden-screen">
    <button className="back-link" onClick={onBack}><Icon name="back"/>Home</button>
    <div className="garden-heading"><p className="eyebrow">EVERY LITTLE MOMENT GROWS</p><h1>Milo's Garden</h1><p>Every time you make time for something you love, you help something grow.</p></div>
    <div className={`garden-world garden-stage-${stage.number}`}>
      <div className="garden-sky"><i/><i/><span/></div>
      <div className="garden-hills h1"/><div className="garden-hills h2"/>
      <div className="milo-house"><i/><span/><b/></div>
      <div className="garden-path"/>
      <span className="static-tree tree-one"><i/><b/></span>
      <span className="static-tree tree-two"><i/><b/></span>
      <span className="garden-bench"/>
      <span className="flower-bed">{[0,1,2,3,4].map(i=><i key={i}/>)}</span>
      {visualRewards.slice(-10).map((reward,i)=><button aria-label={`View ${reward.label}`} onClick={()=>setSelected(reward)} key={reward.id} className={`garden-unlock ${reward.type} pos-${i%10}`}><i/><span/></button>)}
      <button className={`garden-milo ${miloHappy?'celebrate':''}`} onClick={()=>{setMiloHappy(true);setTimeout(()=>setMiloHappy(false),700)}} aria-label="Say hello to Milo"><Companion type={data.companion} size={106} color={data.companionColor} pattern={data.companionPattern}/><small>{miloHappy?'Look at our garden!':'Tap Milo'}</small></button>
    </div>
    <section className="garden-level"><div><span>STAGE {stage.number} OF 4</span><h2>{stage.name}</h2><p>{stage.next?`${stage.next} more garden moments until the next stage.`:'Your garden is thriving — and can always keep growing.'}</p></div><strong>{Math.min(100,stage.number*25)}%</strong><i><b style={{width:`${stage.number*25}%`}}/></i></section>
    <div className="section-heading"><div><span>RECENT REWARDS</span><h2>What you've helped grow</h2></div></div>
    <div className="garden-rewards">{rewards.slice(-3).reverse().map(r=><button onClick={()=>setSelected(r)} key={r.id}><span className={`reward-icon ${r.type}`}><i/></span><div><strong>{r.label}</strong><small>{r.source}</small></div><Icon name="chevron" size={16}/></button>)}</div>
    {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="sheet garden-detail" onClick={e=>e.stopPropagation()}><div className="sheet-handle"/><button className="sheet-close" onClick={()=>setSelected(null)}><Icon name="close"/></button><div className={`reward-plant ${selected.type}`}><i/><span/></div><p className="eyebrow">GARDEN MEMORY</p><h2>{selected.label}</h2><p>This grew on {selected.date} when you reached <strong>{selected.source}</strong>.</p><div className="garden-memory-note"><Companion type={data.companion} size={64} color={data.companionColor} pattern={data.companionPattern}/><span>“This one reminds me that small steps really do become something beautiful.”</span></div></div></div>}
  </div>
}

function CompanionTab({ data, plans }: { data: Data; plans: Record<string, WeeklyPlan> }) {
  const hobby = data.hobbies[0] || 'Art & Drawing'
  const progress = data.hobbyProgress[hobby] || 0
  const project = getProjectPath(hobby)[Math.min(progress, 19)]
  const [input, setInput] = useState('')
  const [expression, setExpression] = useState('happy')
  const [messages, setMessages] = useState([
    { from:'pet', text:`Hi ${data.name}! I remember you're working on “${project.title}” in ${hobby}. What would make your next step feel easier?` },
  ])
  const respond = (text: string) => {
    if (!text.trim()) return
    const lower=text.toLowerCase()
    let answer=`For “${project.title},” try one ${project.duration} session focused only on ${project.desc.toLowerCase()} You don't need to finish it today.`
    if (lower.includes('motivat')) answer=`It makes sense that motivation comes and goes. Your ${hobby} progress is still here. How about opening your materials for five minutes, with full permission to stop there?`
    else if (lower.includes('next')) answer=`You're at the ${project.stage} stage. “${project.title}” is your next unlocked project, and it builds naturally on the ${progress} projects you've already completed.`
    else if (lower.includes('plan') || lower.includes('session')) { const p=plans[hobby]; answer=`Let's keep it realistic: ${p?.days?.[0] || 'Saturday'} in the ${p?.time?.toLowerCase() || 'evening'} for ${project.duration}. I’d start with five minutes of setup, then one focused step.` }
    else if (lower.includes('colour') || lower.includes('color') || lower.includes('blend')) answer=`For smoother color blending, keep both edges slightly damp and move from the lighter color into the darker one. On your current ${project.title.toLowerCase()} project, test the blend on scrap paper first.`
    setMessages(m=>[...m,{from:'user',text},{from:'pet',text:answer}])
    setInput('')
    setExpression('celebrate')
    setTimeout(()=>setExpression('happy'),700)
  }
  const prompts=['Help me with my project','What should I try next?','Give me some motivation','Teach me something new','Plan my next session']
  return <div className="tab-screen companion-tab"><AppHeader title={data.companionName || 'Milo'} subtitle={`${companions.find(c => c.type === data.companion)?.trait || 'Calm & curious'} hobby assistant`} />
    <div className={`companion-stage expressive ${expression}`}><span className="stage-spark s1"><Icon name="spark" /></span><Companion type={data.companion} size={178} color={data.companionColor} pattern={data.companionPattern} /><span className="mood-badge"><i /> Here with you</span></div>
    <div className="context-chip"><Icon name="palette" size={15}/><span>Context: {hobby} · {project.stage} · {project.title}</span></div>
    <div className="message-history">{messages.map((m,i)=><div key={i} className={`message ${m.from}`}>{m.from==='pet'&&<span><Icon name="spark" size={13}/></span>}<p>{m.text}</p></div>)}</div>
    <div className="quick-prompts">{prompts.map(p=><button key={p} onClick={()=>respond(p)}>{p}</button>)}</div>
    <form className="chat-input" onSubmit={e=>{e.preventDefault();respond(input)}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder={`Ask ${data.companionName || 'Milo'} about your hobbies...`}/><button type="submit" disabled={!input.trim()} aria-label="Send"><Icon name="arrow" size={18}/></button></form>
    <p className="simulation-note">Context-aware responses are simulated for this prototype.</p>
  </div>
}

const inspirationItems = [
  {id:'paint-1',title:'A quiet mountain landscape',tag:'Painting',image:'/images/watercolor.jpg',project:'Paint a complete landscape'},
  {id:'music-1',title:'Songs for slow Sunday mornings',tag:'Guitar',image:'/images/guitar.jpg',project:'Recreate an old favorite'},
  {id:'craft-1',title:'Pressed botanical studies',tag:'DIY',image:'/images/botanical.jpg',project:'Make a small personal project'},
  {id:'paint-2',title:'Soft sunset color study',tag:'Painting',image:'/images/watercolor.jpg',project:'Mix a sunset sky'},
  {id:'garden-1',title:'A tiny balcony herb garden',tag:'Gardening',image:'/images/garden.jpg',project:'Finish a tiny project'},
  {id:'music-2',title:'Build a cozy practice corner',tag:'Guitar',image:'/images/guitar.jpg',project:'Reconnect with the basics'},
  {id:'photo-1',title:'Tell a story with three photographs',tag:'Photography',image:'/images/photography.jpg',project:'Build a three-piece series'},
  {id:'bake-1',title:'A joyful lemon layer cake',tag:'Cooking',image:'/images/baking.jpg',project:'Complete a weekend project'},
  {id:'dance-1',title:'Movement in the morning light',tag:'Dance',image:'/images/dance.jpg',project:'Try a different style'},
  {id:'garden-2',title:'Terracotta and trailing flowers',tag:'Gardening',image:'/images/garden.jpg',project:'Plan an original idea'},
  {id:'photo-2',title:'Make a nature photo journal',tag:'Photography',image:'/images/photography.jpg',project:'Make something for a friend'},
  {id:'bake-2',title:'Slow weekend baking ritual',tag:'Cooking',image:'/images/baking.jpg',project:'Recreate something you admire'},
  {id:'dance-2',title:'Explore a flowing movement phrase',tag:'Dance',image:'/images/dance.jpg',project:'Work from a new prompt'},
  {id:'craft-2',title:'Botanical cards made by hand',tag:'DIY',image:'/images/botanical.jpg',project:'Create with a personal theme'},
]

function FeedTab({ saved, setSaved, goHobbies, selected, setSelected }: { saved:string[]; setSaved:(s:string[])=>void; goHobbies:()=>void; selected:string[]; setSelected:(s:string[])=>void }) {
  const filters=['All interests','Painting','Photography','Guitar','Writing','Gardening','Cooking','DIY','Dance']
  const [search,setSearch]=useState('')
  const [open,setOpen]=useState<typeof inspirationItems[0]|null>(null)
  const toggle=(f:string)=>{ if(f==='All interests') setSelected(['All interests']); else setSelected(selected.includes(f)?selected.filter(x=>x!==f):[...selected.filter(x=>x!=='All interests'),f]) }
  const visible=inspirationItems.filter(x=>(selected.includes('All interests')||!selected.length||selected.includes(x.tag))&&x.title.toLowerCase().includes(search.toLowerCase()))
  return <div className="tab-screen inspiration-tab"><AppHeader title="Feed" subtitle="Ideas to save, explore, or simply enjoy." action={<span className="collection-count">{saved.length} saved</span>} />
    <div className="feed-search"><Icon name="spark" size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search inspiration"/></div>
    <div className="interest-chips">{filters.map(f=><button className={selected.includes(f)?'selected':''} onClick={()=>toggle(f)} key={f}>{f}</button>)}</div>
    <div className="masonry">{visible.map((item,i)=><article key={item.id} className={`inspiration-card tall-${i%3}`} onClick={()=>setOpen(item)}><Image src={item.image} alt={item.title} width={360} height={240}/><button className={`save-pin ${saved.includes(item.id)?'saved':''}`} onClick={e=>{e.stopPropagation();setSaved(saved.includes(item.id)?saved.filter(x=>x!==item.id):[...saved,item.id])}} aria-label="Save inspiration"><Icon name={saved.includes(item.id)?'check':'plus'} size={15}/></button><div><small>{item.tag}</small><h3>{item.title}</h3></div></article>)}</div>
    {!visible.length&&<div className="empty-state"><Icon name="spark"/><p>No ideas match yet. Try another interest.</p></div>}
    {open&&<div className="modal-backdrop" onClick={()=>setOpen(null)}><div className="inspiration-sheet" onClick={e=>e.stopPropagation()}><button className="sheet-close" onClick={()=>setOpen(null)}><Icon name="close"/></button><Image src={open.image} alt={open.title} width={400} height={320}/><div><p className="eyebrow">{open.tag} inspiration</p><h2>{open.title}</h2><p>Save this idea for later, or connect it to a guided Revive project when you feel ready.</p><div className="post-actions"><button onClick={()=>setSaved(saved.includes(open.id)?saved.filter(x=>x!==open.id):[...saved,open.id])}><Icon name={saved.includes(open.id)?'check':'plus'} size={17}/>{saved.includes(open.id)?'Saved':'Save to board'}</button><button onClick={()=>setOpen(null)}><Icon name="arrow" size={17}/>Share</button></div><Button onClick={goHobbies}>Try “{open.project}”</Button></div></div></div>}
  </div>
}

function CommunityTab({ data, persistedPosts, onPostCreated }: { data:Data; persistedPosts: CommunityPostView[]; onPostCreated: (post: CommunityPostView) => void }) {
  const [likes,setLikes]=useState<number[]>([])
  const [saved,setSaved]=useState<number[]>([])
  const [following,setFollowing]=useState(false)
  const [commenting,setCommenting]=useState<number|null>(null)
  const [comment,setComment]=useState('')
  const [comments,setComments]=useState<Record<number,string[]>>({})
  const [creating,setCreating]=useState(false)
  const [caption,setCaption]=useState('')
  const [postHobby,setPostHobby]=useState('Art & Painting')
  const [postTags,setPostTags]=useState('#workinprogress #startagain')
  const [postError,setPostError]=useState('')
  const [posting,setPosting]=useState(false)
  const [posted,setPosted]=useState(false)
  const [profile,setProfile]=useState(false)
  const [communityFilters,setCommunityFilters]=useState<string[]>(['All'])
  const [joined,setJoined]=useState(false)
  const [query,setQuery]=useState('')
  const [shared,setShared]=useState<number[]>([])
  const samplePosts=[
    {user:'Aanya',initial:'A',hobby:'Painting',caption:'Finally got back to painting after almost a year. Started with a simple sunset and honestly forgot how much I enjoyed this.',image:'/images/watercolor.jpg',likes:84},
    {user:'Kabir',initial:'K',hobby:'Music',caption:'Slowed this song right down and found the joy in it again. No rush, just four good chords.',image:'/images/guitar.jpg',likes:51},
  ]
  const posts=[...persistedPosts.map(post=>({...post,image:post.image||hobbyImage(post.hobby)})),...samplePosts]
  const publishPost=async()=>{
    setPosting(true)
    setPostError('')
    const result=await createCommunityPostAction({caption,hobby:postHobby,tags:postTags.split(/\s+/).filter(Boolean)})
    setPosting(false)
    if(!result.ok){setPostError(result.message||'Unable to publish right now.');return}
    onPostCreated({id:`local-${Date.now()}`,user:data.name||'You',initial:(data.name||'Y')[0],hobby:postHobby,caption,image:hobbyImage(postHobby),likes:0})
    setPosted(true);setCreating(false);setCaption('')
  }
  if(profile) return <div className="tab-screen community-profile"><button className="back-link" onClick={()=>setProfile(false)}><Icon name="back"/>Community</button><div className="public-profile"><span className="feed-avatar">A</span><h1>Aanya</h1><p>Watercolor learner, weekend gardener, and collector of small creative moments.</p><div><strong>24<small>posts</small></strong><strong>1.2k<small>followers</small></strong><strong>186<small>following</small></strong></div><button onClick={()=>setFollowing(!following)}>{following?'Following':'Follow Aanya'}</button></div><div className="profile-gallery">{['/images/watercolor.jpg','/images/botanical.jpg','/images/watercolor.jpg'].map((x,i)=><Image src={x} key={i} alt="Shared project" width={120} height={120}/>)}</div></div>
  return <div className="tab-screen community-tab"><AppHeader title="Community" subtitle="People, conversations, and shared hobby moments." action={<button className="round-add" onClick={()=>setCreating(true)}><Icon name="plus"/></button>}/>
    <div className="feed-search"><Icon name="community" size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search people or posts"/></div>
    <div className="interest-chips">{['All','Art & Painting','Photography','Music','Writing','Cooking','Gardening','DIY'].map(f=><button className={communityFilters.includes(f)?'selected':''} onClick={()=>f==='All'?setCommunityFilters(['All']):setCommunityFilters(prev=>prev.includes(f)?prev.filter(x=>x!==f):[...prev.filter(x=>x!=='All'),f])} key={f}>{f}</button>)}</div>
    <section className="community-event"><span><strong>22</strong>JUN</span><div><small>EVENT NEAR YOU</small><h3>Sunday sketch & slow coffee</h3><p>10:30 AM · 18 people going</p></div><button onClick={()=>setJoined(!joined)}>{joined?<Icon name="check" size={16}/>:<Icon name="plus" size={16}/>}</button></section>
    {posted&&<div className="published-note"><Icon name="check" size={16}/>Your post is now part of the community.</div>}
    <div className="social-feed">{posts.filter(p=>(p.user+p.hobby+p.caption).toLowerCase().includes(query.toLowerCase())).map((p,i)=><article className="social-post" key={p.user}><header><button onClick={()=>i===0&&setProfile(true)}><span className="feed-avatar">{p.initial}</span><div><strong>{p.user}</strong><small>{p.hobby} · {i?'Yesterday':'2h ago'}</small></div></button>{i===0&&<button className="follow-link" onClick={()=>setFollowing(!following)}>{following?'Following':'Follow'}</button>}</header><Image src={p.image} alt={`${p.user}'s ${p.hobby} project`} width={400} height={275}/><div className="social-actions"><button className={likes.includes(i)?'active':''} onClick={()=>setLikes(likes.includes(i)?likes.filter(x=>x!==i):[...likes,i])}><Icon name="spark" size={18}/>{p.likes+(likes.includes(i)?1:0)}</button><button onClick={()=>setCommenting(commenting===i?null:i)}><Icon name="community" size={18}/>{12+(comments[i]?.length||0)}</button><button className={shared.includes(i)?'active':''} onClick={()=>setShared([...shared,i])}><Icon name="arrow" size={18}/>{shared.includes(i)?'Shared':''}</button><button className={saved.includes(i)?'active':''} onClick={()=>setSaved(saved.includes(i)?saved.filter(x=>x!==i):[...saved,i])}><Icon name={saved.includes(i)?'check':'plus'} size={18}/></button></div><p><strong>{p.user}</strong> {p.caption}</p><div className="post-tags">#{p.hobby.toLowerCase()} #startagain</div>{comments[i]?.map((c,j)=><p className="comment" key={j}><strong>{data.name}</strong> {c}</p>)}{commenting===i&&<form className="comment-box" onSubmit={e=>{e.preventDefault();if(comment.trim()){setComments({...comments,[i]:[...(comments[i]||[]),comment]});setComment('')}}}><input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a kind comment..."/><button>Post</button></form>}</article>)}</div>
    {creating&&<div className="modal-backdrop" onClick={()=>setCreating(false)}><div className="sheet create-post" onClick={e=>e.stopPropagation()}><div className="sheet-handle"/><button className="sheet-close" onClick={()=>setCreating(false)}><Icon name="close"/></button><p className="eyebrow">SHARE YOUR MOMENT</p><h2>Create a post</h2><label className="upload-box"><Icon name="camera"/><span>Photo uploads can be added after publishing</span></label><label className="field-label">Caption<textarea value={caption} onChange={e=>setCaption(e.target.value)} placeholder="What would you like to share?"/></label><label className="field-label">Hobby<select value={postHobby} onChange={e=>setPostHobby(e.target.value)}><option>Art & Painting</option><option>Music</option><option>Photography</option></select></label><label className="field-label">Tags<input value={postTags} onChange={e=>setPostTags(e.target.value)} placeholder="#workinprogress #startagain"/></label>{postError&&<p className="auth-error" role="alert">{postError}</p>}<Button disabled={!caption.trim()||posting} onClick={publishPost}>{posting?'Publishing…':'Publish post'}</Button></div></div>}
  </div>
}

function ProfileTab({ data, setData, onLogout }: { data: Data; setData: (data: Data) => void; onLogout: () => void }) {
  const toggleNames=['Hobby session reminders','Weekly check-ins','Progress & milestone notes']
  const toggles=toggleNames.map(name=>Boolean(data.notificationSettings[name]))
  return <div className="tab-screen profile-tab"><AppHeader title="Your space" subtitle="Shape Revive around what feels right." />
    <div className="profile-card"><div className="avatar large">{(data.name || 'N')[0]}</div><div><h2>{data.name || 'Navreet'}</h2><p>Finding my way back, gently.</p></div><button><Icon name="edit" /></button></div>
    <p className="settings-label">YOUR JOURNEY</p>
    <div className="settings-group">{[['Selected hobbies', `${data.hobbies.length || 2} hobbies`,'leaf'], ['Weekly rhythm', data.frequency || 'Twice a week','clock'], ['Companion', data.companionName || 'Milo','companion']].map(([title, sub, icon]) => <button key={title}><span><Icon name={icon as IconName} /></span><div><strong>{title}</strong><small>{sub}</small></div><Icon name="chevron" /></button>)}</div>
    <p className="settings-label">GENTLE REMINDERS</p>
    <div className="settings-group">{['Session reminders','Weekly check-ins','Milestone notes'].map((x,i) => <div className="setting-toggle" key={x}><div><strong>{x}</strong><small>{i === 0 ? 'A nudge before planned time' : i === 1 ? 'Reflect at the end of your week' : 'Celebrate meaningful moments'}</small></div><button className={`toggle ${toggles[i] ? 'on' : ''}`} onClick={() => setData({...data,notificationSettings:{...data.notificationSettings,[toggleNames[i]]:!toggles[i]}})}><i /></button></div>)}</div>
    <p className="settings-label">ACCOUNT</p><div className="settings-group"><button><div><strong>Account settings</strong><small>Email, password and privacy</small></div><Icon name="chevron" /></button><button><div><strong>About Revive</strong><small>Our philosophy and support</small></div><Icon name="chevron" /></button><button onClick={onLogout}><div><strong>Log out</strong><small>Your progress is safely stored</small></div><Icon name="chevron" /></button></div>
  </div>
}

function PauseJourney({ data, onClose, onComplete }: { data:Data; onClose:()=>void; onComplete:(p:PauseState)=>void }) {
  const [step,setStep]=useState(1)
  const [reason,setReason]=useState('')
  const [note,setNote]=useState('')
  const [duration,setDuration]=useState('1 week')
  const [custom,setCustom]=useState('')
  const hobby=(data.hobbies.length?data.hobbies:['Art & Drawing'])[0]
  const projects=getProjectPath(hobby)
  const [choice,setChoice]=useState(projects[Math.min(data.hobbyProgress[hobby]||0,19)].title)
  const dateAfter=(days:number)=>{const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
  const dates:Record<string,string>={'3 days':dateAfter(3),'1 week':dateAfter(7),'2 weeks':dateAfter(14),'1 month':dateAfter(30)}
  const returnDate=duration==='Custom date'?custom:dates[duration]
  return <div className="screen pause-flow"><header className="pause-top"><button className="icon-button" onClick={step===1?onClose:()=>setStep(step-1)}><Icon name="back"/></button><Logo small/><span>{step} of 4</span></header><div className="pause-progress"><i style={{width:`${step*25}%`}}/></div><main>
    {step===1&&<><p className="eyebrow">A GENTLE CHECK-IN</p><h1>Hey, is everything okay?</h1><p className="pause-lead">Sometimes life gets busy, and it's completely okay to take a step back. You don't have to explain, but you can tell us what feels true.</p><div className="pause-reasons">{["I've been busy lately","I need some time for myself","I'm feeling overwhelmed","I've lost motivation","I just need a little break","Something else"].map(r=><button className={reason===r?'selected':''} onClick={()=>setReason(r)} key={r}>{r}<i>{reason===r&&<Icon name="check" size={13}/>}</i></button>)}</div><label className="field-label">Anything else? Optional<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Share only what feels comfortable"/></label><div className="care-note"><Icon name="community" size={19}/><p>Remember, you don't have to figure everything out alone. Spending time with people you care about can help, too.</p></div></>}
    {step===2&&<><p className="eyebrow">YOUR BREAK, YOUR TIMING</p><h1>How long would you like to take a break?</h1><p className="pause-lead">Your hobbies, skill levels, and completed projects will be right here when you're ready.</p><div className="duration-grid">{['3 days','1 week','2 weeks','1 month','Custom date'].map(d=><button className={duration===d?'selected':''} onClick={()=>setDuration(d)} key={d}>{d}<i>{duration===d&&<Icon name="check" size={14}/>}</i></button>)}</div>{duration==='Custom date'&&<label className="field-label">Choose your return date<input type="date" min={dateAfter(1)} value={custom} onChange={e=>setCustom(e.target.value)}/></label>}<div className="return-date-card"><Icon name="clock"/><div><small>EXPECTED RETURN</small><strong>{returnDate||'Choose a date'}</strong></div></div></>}
    {step===3&&<><p className="eyebrow">A NICE THING TO RETURN TO</p><h1>Let's make coming back a little easier.</h1><p className="pause-lead">Choose one project. It can be familiar, available now, or something you'd like to work toward.</p><div className="return-choices">{projects.slice(0,5).map((p,i)=><button className={choice===p.title?'selected':''} onClick={()=>setChoice(p.title)} key={p.title}><Image src={hobbyImage(hobby)} alt="" width={58} height={58}/><div><small>{i<(data.hobbyProgress[hobby]||0)?'REVISIT':i===(data.hobbyProgress[hobby]||0)?'AVAILABLE':'WORK TOWARD'}</small><strong>{p.title}</strong><span>{hobby} · {p.difficulty} · {p.duration}</span></div><i>{choice===p.title&&<Icon name="check" size={14}/>}</i></button>)}</div></>}
    {step===4&&<><div className="pause-confirm-art"><Companion type={data.companion} size={135} color={data.companionColor} pattern={data.companionPattern}/></div><p className="eyebrow">ALL SET</p><h1>Your break is officially yours.</h1><p className="pause-lead">Take the time you need. We'll be here when you're ready.</p><div className="pause-summary"><div><span>Pause starts</span><strong>{new Date().toISOString().slice(0,10)}</strong></div><div><span>Expected return</span><strong>{returnDate}</strong></div><div><span>Return project</span><strong>{choice}</strong><small>{hobby}</small></div><p><Icon name="check" size={15}/>A gentle return reminder is scheduled.</p></div></>}
  </main><footer><Button disabled={(step===2&&!returnDate)||!choice} onClick={()=>step<4?setStep(step+1):onComplete({active:true,returnDate,project:choice,hobby,reminder:true})}>{step===1?'Continue':step===2?'Continue':step===3?'Save my return plan':'Done'}</Button></footer></div>
}

function Dashboard({ data, setData, communityPosts, setCommunityPosts, onLogout }: { data: Data; setData: (d: Data) => void; communityPosts: CommunityPostView[]; setCommunityPosts: (posts: CommunityPostView[]) => void; onLogout: () => void }) {
  const [tab, setTab] = useState('Home')
  const baseHobbies=data.hobbies.length?data.hobbies:['Art & Drawing','Music & Instruments']
  const plans=Object.keys(data.weeklyPlans).length?data.weeklyPlans:Object.fromEntries(baseHobbies.map((h,i)=>[h,{count:i?1:2,days:i?['Sat']:['Wed','Sat'],time:i?'Morning':'Evening',enabled:true}]))
  const setPlans=(next:Record<string,WeeklyPlan>)=>setData({...data,weeklyPlans:next})
  const pause=data.pauseState
  const setPause=(next:PauseState)=>setData({...data,pauseState:next})
  const [pauseFlow,setPauseFlow]=useState(false)
  const saved=data.savedInspiration
  const setSaved=(next:string[])=>setData({...data,savedInspiration:next})
  const firstHobby=baseHobbies[0]
  const defaultFeed=firstHobby.includes('Music')?'Guitar':firstHobby.includes('Photo')?'Photography':firstHobby.includes('Garden')?'Gardening':firstHobby.includes('Cook')?'Cooking':firstHobby.includes('Dance')?'Dance':firstHobby.includes('Craft')?'DIY':'Painting'
  const feedFilters=data.feedFilters.length?data.feedFilters:[defaultFeed]
  const setFeedFilters=(next:string[])=>setData({...data,feedFilters:next})
  if(pauseFlow) return <PauseJourney data={data} onClose={()=>setPauseFlow(false)} onComplete={p=>{setPause(p);setPauseFlow(false);setTab('Home')}}/>
  return <div className="screen dashboard">
    <header className="dashboard-topbar"><Logo small /><button className={`top-profile ${tab === 'Profile' ? 'active' : ''}`} onClick={() => setTab('Profile')} aria-label="Open profile"><span><small>PROFILE</small><strong>{data.name || 'Navreet'}</strong></span><i className="avatar">{(data.name || 'N')[0]}</i></button></header>
    <main className="dashboard-scroll">{tab === 'Home' && <Home data={data} setData={setData} setTab={setTab} plans={plans} setPlans={setPlans} pause={pause} setPause={setPause} onPause={()=>setPauseFlow(true)}/>}
      {tab === 'Garden' && <GardenScreen data={data} onBack={()=>setTab('Home')}/>}
      {tab === 'My Hobbies' && <HobbiesTab data={data} setData={setData} onGarden={()=>setTab('Garden')}/>}
      {tab === 'Companion' && <CompanionTab data={data} plans={plans}/>}
      {tab === 'Feed' && <FeedTab saved={saved} setSaved={setSaved} selected={feedFilters} setSelected={setFeedFilters} goHobbies={()=>setTab('My Hobbies')}/>}
      {tab === 'Community' && <CommunityTab data={data} persistedPosts={communityPosts} onPostCreated={post=>setCommunityPosts([post,...communityPosts])}/>}
      {tab === 'Profile' && <ProfileTab data={data} setData={setData} onLogout={onLogout}/>}</main>
    <BottomNav tab={tab} setTab={setTab} />
  </div>
}

export default function App({ authenticated: initialAuthenticated, data: initialData, communityPosts: initialCommunityPosts }: { authenticated: boolean; data: ReviveData; communityPosts: CommunityPostView[] }) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated)
  const [step, setStep] = useState(initialAuthenticated ? 13 : 1)
  const [data, setData] = useState(initialData)
  const [communityPosts,setCommunityPosts]=useState(initialCommunityPosts)
  const [loginDirect, setLoginDirect] = useState(false)
  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => Math.max(1, s - 1))
  const props = useMemo(() => ({ data, setData, next, back }), [data, step])
  useEffect(()=>{
    if(!authenticated||step!==13)return
    const timer=window.setTimeout(()=>{void saveJourneyAction(data).then(result=>{if(!result.ok)console.warn(`[Revive] ${result.message}`)})},700)
    return()=>window.clearTimeout(timer)
  },[authenticated,data,step])
  const logout=async()=>{await logoutAction();setAuthenticated(false);setData(defaultReviveData);setCommunityPosts([]);setStep(1)}
  return <div className="app-canvas"><div className="device-shell">
    <span className="device-button action" aria-hidden="true" />
    <span className="device-button volume-up" aria-hidden="true" />
    <span className="device-button volume-down" aria-hidden="true" />
    <span className="device-button power" aria-hidden="true" />
    <div className="mobile-frame">
      <div className="dynamic-island" aria-hidden="true"><i /></div>
      {step === 1 && <Welcome onNext={next} onLogin={() => { setLoginDirect(true); setStep(12) }} />}
      {step === 2 && <Reassurance onNext={next} onBack={back} />}
      {step === 3 && <HobbiesStep {...props} />}
      {step === 4 && <PreviousStep {...props} />}
      {step === 5 && <LastTimeStep {...props} />}
      {step === 6 && <FeelingsStep {...props} />}
      {step === 7 && <GenericMultiStep {...props} kind="changes" />}
      {step === 8 && <GenericMultiStep {...props} kind="barriers" />}
      {step === 9 && <ScheduleStep {...props} />}
      {step === 10 && <CompanionStep {...props} />}
      {step === 11 && <NotificationsStep {...props} />}
      {step === 12 && <AuthScreen {...props} initialLogin={loginDirect} finish={() => {setAuthenticated(true);setStep(13)}} />}
      {step === 13 && <Dashboard data={data} setData={setData} communityPosts={communityPosts} setCommunityPosts={setCommunityPosts} onLogout={logout} />}
      <div className="home-indicator" aria-hidden="true" />
    </div>
  </div></div>
}
