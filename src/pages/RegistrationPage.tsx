import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, FileCheck2, GraduationCap, Phone, Printer, Save, ShieldCheck, Upload, UserRound } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import InnerPageHero from '../components/InnerPageHero';
import InlineCampusVisual from '../components/InlineCampusVisual';
import VisualStoryStrip from '../components/VisualStoryStrip';
import StackingPage from '../components/stacking/StackingPage';
import { college } from '../data/college';

const steps = [
  { title: 'Student details', short: 'Student', icon: UserRound },
  { title: 'Parent & address', short: 'Parent', icon: Phone },
  { title: 'Academic details', short: 'Academic', icon: GraduationCap },
  { title: 'Documents & consent', short: 'Documents', icon: FileCheck2 },
] as const;

const emptyForm: Record<string, string> = {
  studentFirstName: '', studentLastName: '', dateOfBirth: '', gender: '', bloodGroup: '', category: '', nationality: 'Indian', studentAadhaar: '',
  guardianName: '', relationship: '', guardianPhone: '', alternatePhone: '', guardianEmail: '', occupation: '', annualIncome: '', address: '', city: '', district: 'Kanpur Nagar', state: 'Uttar Pradesh', pinCode: '',
  applyingClass: '', preferredStream: '', previousSchool: '', previousClass: '', previousBoard: '', lastPercentage: '', medium: '', transportRequired: '', siblingAtHls: '', siblingDetails: '',
  medicalNotes: '', additionalMessage: '', declaration: '', communicationConsent: '',
};

function loadDraft() {
  if (typeof window === 'undefined') return emptyForm;
  try {
    const saved = window.localStorage.getItem('hls-registration-draft');
    return saved ? { ...emptyForm, ...JSON.parse(saved) as Record<string, string> } : emptyForm;
  } catch {
    return emptyForm;
  }
}

export default function RegistrationPage() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>(loadDraft);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem('hls-registration-draft', JSON.stringify(values));
        setSaved(true);
      } catch {
        setSaved(false);
      }
      window.setTimeout(() => setSaved(false), 1200);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [values]);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);
  const update = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));

  const validateStep = (stepIndex: number) => {
    const group = formRef.current?.querySelector<HTMLElement>(`[data-form-step="${stepIndex}"]`);
    if (!group) return true;
    const fields = Array.from(group.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea'));
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(steps.length - 1, current + 1));
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep(step) || !event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    setSubmitting(true);
    setError('');
    const reference = `HLS-${new Date().getFullYear()}-${Date.now().toString().slice(-7)}`;
    const formData = new FormData(event.currentTarget);
    formData.set('applicationReference', reference);
    formData.set('submittedAt', new Date().toISOString());

    try {
      const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
      if (!isLocal) {
        const response = await fetch('/', { method: 'POST', body: formData });
        if (!response.ok) throw new Error('The online form service did not accept the application.');
      }
      try {
        window.localStorage.removeItem('hls-registration-draft');
      } catch {
        // Registration still succeeds when browser storage is unavailable.
      }
      setApplicationId(reference);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'The application could not be submitted. Please try again or contact the college.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- Confirmation screen ---- */
  if (applicationId) {
    return (
      <main id="main-content" className="inner-page-shell">
        <div className="inner-page-bg-accents" aria-hidden="true" />
        <section className="grid min-h-[70vh] place-items-center px-4" style={{ paddingBlock: 'clamp(7rem, 12vw, 10rem)' }}>
          <div className="glass-surface w-full max-w-3xl rounded-[1.75rem] border border-white/70 p-8 text-center sm:p-12 print:bg-white print:shadow-none">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-secondary">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Registration received</p>
            <h1 className="mt-3 font-display font-bold text-text-dark" style={{ fontSize: 'var(--text-3xl)' }}>
              Thank you, {values.studentFirstName || 'student'}.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl leading-[1.7] text-text-light">
              Your online registration has been prepared successfully. This is a registration request, not a final admission confirmation. The college team should verify documents, eligibility and seat availability.
            </p>
            <div className="mx-auto mt-8 max-w-md rounded-2xl bg-orange-50/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">Application reference</p>
              <p className="mt-2 break-all font-display text-2xl font-bold text-text-dark sm:text-3xl">{applicationId}</p>
              <p className="mt-2 text-sm text-text-light">Keep this number for communication with the admission office.</p>
            </div>
            <dl className="mx-auto mt-8 grid max-w-2xl gap-4 text-left sm:grid-cols-2">
              <Summary label="Student" value={`${values.studentFirstName} ${values.studentLastName}`.trim()} />
              <Summary label="Applying for" value={values.applyingClass} />
              <Summary label="Parent / guardian" value={values.guardianName} />
              <Summary label="Mobile" value={values.guardianPhone} />
            </dl>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row print:hidden">
              <button type="button" onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/20">
                <Printer className="h-4 w-4" /> Print confirmation
              </button>
              <a href="/" className="inline-flex items-center justify-center rounded-full border border-gray-200/80 bg-white/80 px-6 py-3 text-sm font-semibold text-text-dark transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
                Return to home
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* ---- Registration form ---- */
  return (
    <main id="main-content" className="inner-page-shell">
      <div className="inner-page-bg-accents" aria-hidden="true" />
      <InnerPageHero
        eyebrow="Admissions"
        title="Register for admission online."
        description="Complete the student registration form from home. The admission office can review the information and contact the parent or guardian about verification and the next step."
        crumbs={[{ label: 'Online Registration' }]}
        aside={(
          <>
            <Clock3 className="h-8 w-8 text-orange-200/80" />
            <h2 className="mt-3 text-lg font-bold">Before you begin</h2>
            <p className="mt-2 text-sm leading-[1.7] text-teal-50/85">Keep the student's date of birth, previous-school details, recent photograph and available academic documents ready.</p>
          </>
        )}
      />

      <StackingPage sections={[
        { id: 'registration-campus-story', theme: 'memory' },
        { id: 'registration-form', theme: 'path', interactive: true, forceFlow: true },
      ]}>
        <VisualStoryStrip
          eyebrow="Life at HLS"
        title="A welcoming campus for learning, confidence and participation."
        description="A few real glimpses from the college help families understand the environment before beginning the online admission process."
        items={[
          { src: '/images/hls-banner-2.png', alt: 'Students gathered at the entrance of HLS Inter College', label: 'College campus', title: 'A familiar and accessible learning environment' },
          { src: '/images/hls-event-1.png', alt: 'HLS students presenting creative academic models', label: 'Student projects', title: 'Learning through ideas and practical work' },
        ]}
      />

        <section className="bg-transparent py-10 lg:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Step indicator */}
            <div className="rounded-[1.5rem] bg-secondary p-6 text-white shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200/80">Application steps</p>
              <ol className="mt-6 grid gap-4">
                {steps.map((item, index) => {
                  const Icon = item.icon;
                  const active = index === step;
                  const complete = index < step;
                  return (
                    <li key={item.title} className={`flex items-center gap-3.5 rounded-xl p-2.5 transition ${active ? 'bg-white text-secondary' : 'text-teal-50'}`}>
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${active ? 'bg-orange-50 text-primary' : complete ? 'bg-teal-500 text-white' : 'bg-white/10 text-white'}`}>
                        {complete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wide opacity-65">Step {index + 1}</span>
                        <span className="text-sm font-semibold">{item.title}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Important notice */}
            <div className="glass-surface rounded-[1.5rem] border border-white/70 p-6">
              <ShieldCheck className="h-8 w-8 text-secondary" />
              <h2 className="mt-3 text-base font-bold text-text-dark">Important</h2>
              <p className="mt-2 text-sm leading-[1.7] text-text-light">Online registration does not guarantee admission. The college will confirm eligibility, documents, class availability and applicable fees.</p>
              <a href={`tel:${college.phones[0].replace(/\s/g, '')}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-orange-700">
                <Phone className="h-4 w-4" /> {college.phones[0]}
              </a>
            </div>

            {/* Campus visual */}
            <InlineCampusVisual
              src="/images/hls-banner-5.jpg"
              alt="HLS Inter College students assembled for a campus activity"
              eyebrow="Student community"
              title="More than classroom learning"
              description="The college encourages participation, discipline and shared campus experiences."
            />
          </aside>

          {/* Form card */}
          <div className="glass-surface overflow-hidden rounded-[1.75rem] border border-white/70">
            {/* Form header */}
            <div className="border-b border-gray-100/60 px-6 py-5 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Step {step + 1} of {steps.length}</p>
                  <h2 className="mt-1 font-display font-bold text-text-dark" style={{ fontSize: 'var(--text-xl)' }}>{steps[step].title}</h2>
                </div>
                <span className="hidden items-center gap-2 text-xs font-medium text-text-light sm:inline-flex">
                  <Save className="h-3.5 w-3.5" /> {saved ? 'Draft saved' : 'Autosave on'}
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100" aria-label={`Registration progress ${Math.round(progress)} percent`}>
                <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Form body */}
            <form ref={formRef} name="student-registration" method="POST" encType="multipart/form-data" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit} className="p-6 sm:p-8">
              <input type="hidden" name="form-name" value="student-registration" />
              <p className="hidden"><label>Do not fill this out: <input name="bot-field" /></label></p>

              {/* Step 0: Student information */}
              <div data-form-step="0" className={step === 0 ? 'grid gap-6' : 'hidden'}>
                <SectionTitle title="Student information" text="Enter the details exactly as they appear on official documents." />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name" required><Input name="studentFirstName" value={values.studentFirstName} onValue={update} autoComplete="given-name" required /></Field>
                  <Field label="Last name" required><Input name="studentLastName" value={values.studentLastName} onValue={update} autoComplete="family-name" required /></Field>
                  <Field label="Date of birth" required><Input type="date" name="dateOfBirth" value={values.dateOfBirth} onValue={update} required /></Field>
                  <Field label="Gender" required><Select name="gender" value={values.gender} onValue={update} required options={['Male', 'Female', 'Other', 'Prefer not to say']} placeholder="Select gender" /></Field>
                  <Field label="Blood group"><Select name="bloodGroup" value={values.bloodGroup} onValue={update} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not known']} placeholder="Select blood group" /></Field>
                  <Field label="Category"><Select name="category" value={values.category} onValue={update} options={['General', 'OBC', 'SC', 'ST', 'Other']} placeholder="Select category" /></Field>
                  <Field label="Nationality"><Input name="nationality" value={values.nationality} onValue={update} /></Field>
                  <Field label="Student Aadhaar number" hint="Optional at initial registration"><Input name="studentAadhaar" value={values.studentAadhaar} onValue={update} inputMode="numeric" pattern="[0-9 ]{12,14}" placeholder="12-digit number" /></Field>
                </div>
              </div>

              {/* Step 1: Parent & address */}
              <div data-form-step="1" className={step === 1 ? 'grid gap-6' : 'hidden'}>
                <SectionTitle title="Parent or guardian" text="The college will use these details for admission communication." />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Parent / guardian name" required><Input name="guardianName" value={values.guardianName} onValue={update} autoComplete="name" required /></Field>
                  <Field label="Relationship" required><Select name="relationship" value={values.relationship} onValue={update} required options={['Father', 'Mother', 'Legal guardian', 'Other']} placeholder="Select relationship" /></Field>
                  <Field label="Mobile number" required><Input name="guardianPhone" value={values.guardianPhone} onValue={update} inputMode="tel" autoComplete="tel" pattern="[0-9+ -]{10,16}" required /></Field>
                  <Field label="Alternate mobile"><Input name="alternatePhone" value={values.alternatePhone} onValue={update} inputMode="tel" pattern="[0-9+ -]{10,16}" /></Field>
                  <Field label="Email address"><Input type="email" name="guardianEmail" value={values.guardianEmail} onValue={update} autoComplete="email" /></Field>
                  <Field label="Occupation"><Input name="occupation" value={values.occupation} onValue={update} /></Field>
                  <Field label="Approx. annual family income"><Select name="annualIncome" value={values.annualIncome} onValue={update} options={['Below â‚¹1 lakh', 'â‚¹1â€“3 lakh', 'â‚¹3â€“5 lakh', 'â‚¹5â€“10 lakh', 'Above â‚¹10 lakh', 'Prefer not to say']} placeholder="Select range" /></Field>
                  <div className="hidden sm:block" />
                </div>
                <div className="mt-2 border-t border-gray-100/60 pt-6">
                  <SectionTitle title="Residential address" text="Provide the current address of the student's family." />
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2"><Field label="Full address" required><Textarea name="address" value={values.address} onValue={update} autoComplete="street-address" required rows={3} /></Field></div>
                    <Field label="City / village" required><Input name="city" value={values.city} onValue={update} autoComplete="address-level2" required /></Field>
                    <Field label="District" required><Input name="district" value={values.district} onValue={update} required /></Field>
                    <Field label="State" required><Input name="state" value={values.state} onValue={update} required /></Field>
                    <Field label="PIN code" required><Input name="pinCode" value={values.pinCode} onValue={update} inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" required /></Field>
                  </div>
                </div>
              </div>

              {/* Step 2: Academic */}
              <div data-form-step="2" className={step === 2 ? 'grid gap-6' : 'hidden'}>
                <SectionTitle title="Academic information" text="Tell the college which class the student is applying for and the previous academic background." />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Applying for class" required><Select name="applyingClass" value={values.applyingClass} onValue={update} required options={college.admissionClasses} placeholder="Select class" /></Field>
                  <Field label="Preferred stream"><Select name="preferredStream" value={values.preferredStream} onValue={update} options={['Not applicable', 'Science', 'Commerce', 'Arts / Humanities', 'To be discussed']} placeholder="For Classes 11â€“12" /></Field>
                  <Field label="Previous school" required><Input name="previousSchool" value={values.previousSchool} onValue={update} required /></Field>
                  <Field label="Last class completed" required><Input name="previousClass" value={values.previousClass} onValue={update} placeholder="Example: Class 8" required /></Field>
                  <Field label="Previous board"><Select name="previousBoard" value={values.previousBoard} onValue={update} options={['UP Board', 'CBSE', 'ICSE', 'Other', 'Not applicable']} placeholder="Select board" /></Field>
                  <Field label="Last percentage / grade"><Input name="lastPercentage" value={values.lastPercentage} onValue={update} placeholder="Example: 72% or B+" /></Field>
                  <Field label="Preferred teaching medium"><Select name="medium" value={values.medium} onValue={update} options={['Hindi', 'English', 'Hindi with English support', 'To be discussed']} placeholder="Select medium" /></Field>
                  <Field label="College transport required?"><Select name="transportRequired" value={values.transportRequired} onValue={update} options={['Yes', 'No', 'May be']} placeholder="Select option" /></Field>
                  <Field label="Sibling currently at HLS?"><Select name="siblingAtHls" value={values.siblingAtHls} onValue={update} options={['Yes', 'No']} placeholder="Select option" /></Field>
                  <Field label="Sibling details"><Input name="siblingDetails" value={values.siblingDetails} onValue={update} placeholder="Name and class, if applicable" /></Field>
                </div>
              </div>

              {/* Step 3: Documents & consent */}
              <div data-form-step="3" className={step === 3 ? 'grid gap-6' : 'hidden'}>
                <SectionTitle title="Documents and declaration" text="Upload available documents now. Missing documents can be verified later by the admission office." />
                <div className="grid gap-5 sm:grid-cols-2">
                  <UploadField name="studentPhoto" label="Recent student photograph" accept="image/png,image/jpeg" required />
                  <UploadField name="lastReportCard" label="Last report card / marksheet" accept="image/png,image/jpeg,application/pdf" />
                  <UploadField name="birthCertificate" label="Birth certificate" accept="image/png,image/jpeg,application/pdf" />
                  <UploadField name="transferCertificate" label="Transfer certificate, if available" accept="image/png,image/jpeg,application/pdf" />
                  <div className="sm:col-span-2"><Field label="Medical condition or support requirement" hint="Share only information relevant to student safety and learning support"><Textarea name="medicalNotes" value={values.medicalNotes} onValue={update} rows={3} /></Field></div>
                  <div className="sm:col-span-2"><Field label="Additional message"><Textarea name="additionalMessage" value={values.additionalMessage} onValue={update} rows={3} placeholder="Any question or information for the admission office" /></Field></div>
                </div>
                <div className="grid gap-4 rounded-[1.25rem] bg-gray-50/80 p-5">
                  <Checkbox name="declaration" checked={values.declaration === 'yes'} onValue={update} required>I confirm that the information provided is true to the best of my knowledge and understand that admission is subject to document verification and college approval.</Checkbox>
                  <Checkbox name="communicationConsent" checked={values.communicationConsent === 'yes'} onValue={update} required>I agree that HLS Inter College may contact the parent or guardian by phone, email or message regarding this registration and admission process.</Checkbox>
                </div>
                <p className="text-sm leading-[1.7] text-text-light">By submitting, the parent or guardian requests admission consideration. The college should publish a final privacy notice and data-retention policy before public launch.</p>
              </div>

              {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}

              {/* Navigation buttons */}
              <div className="mt-8 flex flex-col-reverse justify-between gap-4 border-t border-gray-100/60 pt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200/80 px-5 py-3 text-sm font-semibold text-text-dark transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200/40 transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200/40 transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
                  >
                    {submitting ? 'Submittingâ€¦' : 'Submit registration'} <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        </section>
      </StackingPage>
    </main>
  );
}

/* ---- Sub-components ---- */

function SectionTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-b border-gray-100/60 pb-4">
      <h3 className="font-display text-lg font-bold text-text-dark">{title}</h3>
      <p className="mt-1 text-sm leading-[1.7] text-text-light">{text}</p>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold text-text-dark">
        {label}
        {required && <span className="ml-1 text-xs font-normal text-text-light">(required)</span>}
      </span>
      {children}
      {hint && <span className="text-xs leading-relaxed text-text-light">{hint}</span>}
    </label>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { name: string; value: string; onValue: (name: string, value: string) => void };
function Input({ name, value, onValue, className = '', ...props }: InputProps) {
  return <input {...props} name={name} value={value} onChange={(event) => onValue(name, event.target.value)} className={`form-control ${className}`} />;
}

function Select({ name, value, onValue, options, placeholder, required }: { name: string; value: string; onValue: (name: string, value: string) => void; options: readonly string[]; placeholder: string; required?: boolean }) {
  return (
    <select name={name} value={value} onChange={(event) => onValue(name, event.target.value)} required={required} className="form-control">
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { name: string; value: string; onValue: (name: string, value: string) => void };
function Textarea({ name, value, onValue, className = '', ...props }: TextareaProps) {
  return <textarea {...props} name={name} value={value} onChange={(event) => onValue(name, event.target.value)} className={`form-control ${className}`} />;
}

function UploadField({ name, label, accept, required }: { name: string; label: string; accept: string; required?: boolean }) {
  return (
    <label className="group grid cursor-pointer gap-1.5">
      <span className="text-sm font-semibold text-text-dark">
        {label}
        {required && <span className="ml-1 text-xs font-normal text-text-light">(required)</span>}
      </span>
      <span className="flex min-h-24 items-center gap-4 rounded-[0.875rem] border border-dashed border-gray-300/80 bg-gray-50/60 p-4 transition group-hover:border-primary group-hover:bg-orange-50/30">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-primary shadow-sm">
          <Upload className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-text-dark">Choose file</span>
          <span className="mt-0.5 block text-xs text-text-light">JPG, PNG or PDF. Keep files small for reliable upload.</span>
        </span>
      </span>
      <input className="sr-only" type="file" name={name} accept={accept} required={required} />
    </label>
  );
}

function Checkbox({ name, checked, onValue, required, children }: { name: string; checked: boolean; onValue: (name: string, value: string) => void; required?: boolean; children: ReactNode }) {
  return (
    <label className="flex items-start gap-3 text-sm leading-[1.7] text-text-dark">
      <input
        type="checkbox"
        name={name}
        value="yes"
        checked={checked}
        required={required}
        onChange={(event) => onValue(name, event.target.checked ? 'yes' : '')}
        className="premium-checkbox"
      />
      <span>{children}</span>
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50/80 p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">{label}</dt>
      <dd className="mt-1.5 font-semibold text-text-dark">{value || 'Not provided'}</dd>
    </div>
  );
}



