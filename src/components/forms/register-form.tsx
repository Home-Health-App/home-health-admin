"use client"

import React, { useState, useRef, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/libs/utils"
import {
  IconCamera,
  IconFileText,
  IconUpload,
  IconCheck,
  IconX,
  IconLoader2,
  IconCalendar,
} from "@tabler/icons-react"
import { useRegisterUser } from "@/hooks/auth.hook"
import { useGetInvitationById } from "@/hooks/invitation.hook"
import { useUploadFile, useUploadMultipleFiles } from "@/hooks/upload.hook"
import { useForm } from "@/hooks/use-form"
import { getRegisterSchema, RegisterSchemaType } from "@/schemas/auth.schema"
import { Controller, FormState } from "react-hook-form"
import { Country, State } from "country-state-city"

interface UploadedCert {
  name: string
  url: string
  size?: number
}

export default function RegisterForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const code = searchParams.get("code") || searchParams.get("id") || ""
  const typeParam = searchParams.get("type") || ""

  // Fetch invitation details in the background (no blocking loader)
  const { data: invitationResponse } = useGetInvitationById(code)
  const invitationData = invitationResponse?.data

  // Determine effective registration type (only CARE_GIVER requires documents)
  const type = (invitationData?.type || typeParam || "USER") as "USER" | "CARE_GIVER"
  const isCaregiver = type === "CARE_GIVER"

  const { mutate: register, isPending } = useRegisterUser()

  // Form Zod Schema dynamically adjusted for CARE_GIVER or USER
  const schema = useMemo(() => getRegisterSchema(type), [type])

  // Custom Form Hook
  const {
    register: registerField,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    schema,
    defaultValues: {
      invitation_code: code,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      gender: undefined,
      date_of_birth: "",
      certification: []
    },
  })

  // Focus states for input styling
  const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>({})

  // Fetch countries and derive states dynamically
  const countries = useMemo(() => Country.getAllCountries(), [])
  const watchedCountry = watch("country")

  const states = useMemo(() => {
    if (!watchedCountry) return []
    const countryObj = countries.find((c) => c.name === watchedCountry)
    return countryObj ? State.getStatesOfCountry(countryObj.isoCode) : []
  }, [watchedCountry, countries])

  // Reset state selection when country changes (ignoring initial mount)
  const isFirstMount = useRef(true)
  React.useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    setValue("state", "")
  }, [watchedCountry, setValue])

  // Sync and ensure invitation details are set if invitation data updates
  React.useEffect(() => {
    if (invitationData) {
      if (invitationData.first_name) {
        setValue("first_name", invitationData.first_name, { shouldValidate: true })
      }
      if (invitationData.last_name) {
        setValue("last_name", invitationData.last_name, { shouldValidate: true })
      }
      if (invitationData.email) {
        setValue("email", invitationData.email, { shouldValidate: true })
      }
      if (invitationData.phone) {
        setValue("phone", invitationData.phone, { shouldValidate: true })
      }
      const codeToSet = invitationData.code || code
      if (codeToSet) {
        setValue("invitation_code", codeToSet, { shouldValidate: true })
      }
    } else if (code) {
      setValue("invitation_code", code, { shouldValidate: true })
    }
  }, [invitationData, code, setValue])


  const handleFocus = (field: string) => {
    setFocusedFields((prev) => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field: string) => {
    setFocusedFields((prev) => ({ ...prev, [field]: false }))
  }

  const getInputClassName = (field: keyof RegisterSchemaType) => {
    const isFocused = !!focusedFields[field]
    const hasError = !!errors[field]
    return `w-full !h-12 px-3 rounded-[8px] border font-dm-san-regular text-sm focus-visible:ring-0 outline-hidden transition-all placeholder:text-zinc-400 bg-secondary-light ${hasError
      ? "border-error text-body-text"
      : isFocused
        ? "border-primary-color text-body-text"
        : "border-zinc-200 text-body-text"
      }`
  }

  // Profile picture state
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Certificates state (Caregiver only)
  const [certificates, setCertificates] = useState<UploadedCert[]>([])
  const certInputRef = useRef<HTMLInputElement>(null)

  // Upload hooks
  const { mutate: uploadProfilePic, isPending: isUploadingProfilePic } = useUploadFile()
  const { mutate: uploadCerts, isPending: isUploadingCert } = useUploadMultipleFiles()

  // Submission views
  const [regStatus, setRegStatus] = useState<"idle" | "success" | "failure">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleProfilePicClick = () => {
    fileInputRef.current?.click()
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadProfilePic(file, {
        onSuccess: (res) => {
          if (res.success && res.data?.url) {
            setProfilePic(file)
            setProfilePicPreview(res.data.url)
            setValue("profile_picture", res.data.url)
          }
        },
        onError: (err: any) => {
          console.error("Profile picture upload failed:", err)
        },
      })
    }
  }

  const handleCertClick = () => {
    certInputRef.current?.click()
  }

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadCerts(files, {
        onSuccess: (res) => {
          if (res.success && Array.isArray(res.data)) {
            const newCerts: UploadedCert[] = res.data.map((item) => ({
              name: item.filename,
              url: item.url,
              size: item.size,
            }))
            const updated = [...certificates, ...newCerts]
            setCertificates(updated)
            const urls = updated.map((c) => c.url)
            setValue("certification", urls as any, { shouldValidate: true })
          }
          if (certInputRef.current) {
            certInputRef.current.value = ""
          }
        },
        onError: (err: any) => {
          console.error("Certificate upload failed:", err)
        },
      })
    }
  }

  const handleRemoveCert = (index: number) => {
    const updated = certificates.filter((_, i) => i !== index)
    setCertificates(updated)
    const urls = updated.map((c) => c.url)
    setValue(
      "certification",
      urls.length === 0 ? ("" as any) : (urls as any),
      { shouldValidate: true }
    )
    if (certInputRef.current) {
      certInputRef.current.value = ""
    }
  }

  const onFormSubmit = handleSubmit((values) => {
    const payload = {
      ...values,
      ...(profilePicPreview ? { profile_picture: profilePicPreview } : {}),
      ...(type === "CARE_GIVER" && certificates.length > 0
        ? { certification: certificates.map((c) => c.url) }
        : {}),
    }

    register(payload, {
      onSuccess: (res) => {
        if (!res?.success) {
          setRegStatus("failure")
          setErrorMessage(res.message || "Invalid or expired invitation code.")

          return
        }

        setRegStatus("success")
        setErrorMessage("")
      },
      onError: (err: any) => {
        setRegStatus("failure")
        setErrorMessage(
          err.response?.data?.message || err.message || "Failed to complete profile registration."
        )
      },
    })
  })



  // Success view
  if (regStatus === "success") {
    return (
      <Card className="w-full bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs font-dm-san-regular flex flex-col items-center text-center space-y-6">
        <div className="size-16 rounded-full bg-[#EEFDF4] flex items-center justify-center text-[#22C55E]">
          <IconCheck className="size-8 stroke-3" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-body-text">
            Your account is ready!
          </CardTitle>
          <p className="text-xs text-zinc-500 font-normal max-w-xs leading-relaxed">
            {type === "USER" ?
              "Your family account has been successfully activated. You can now sign in to manage and keep track of your loved one’s care."
              : "Your caregiver account has been successfully activated. You can now sign in to access your assigned patient and begin providing care."}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => router.push("/")}
          className="w-full h-12! rounded-full font-dm-san-regular font-semibold tracking-wide text-sm transition-all border-none outline-hidden cursor-pointer shadow-none flex items-center justify-center bg-[#0B1E3F] hover:bg-[#1B335B] text-white"
        >
          {type === "USER" ?
            "Continue to Log in" : "Continue to the App"}

        </Button>
      </Card>
    )
  }

  // Failure view
  if (regStatus === "failure") {
    return (
      <Card className="w-full bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs font-dm-san-regular flex flex-col items-center text-center space-y-6">
        <div className="size-16 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EF4444]">
          <IconX className="size-8 stroke-3" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-body-text">
            Registration Failed
          </CardTitle>
          <p className="text-xs text-red-500 font-normal max-w-xs leading-relaxed">
            {errorMessage}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setRegStatus("idle")}
          className="w-full h-11! rounded-full font-dm-san-regular font-semibold tracking-wide text-sm transition-all border-none outline-hidden cursor-pointer shadow-none flex items-center justify-center bg-[#0B1E3F] hover:bg-[#1B335B] text-white"
        >
          Try Again
        </Button>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs font-dm-san-regular">

      <CardHeader className="text-center space-y-2 mb-6 p-0">
        <CardTitle className="text-2xl font-bold tracking-tight text-body-text font-dm-san-regular">
          Complete Your Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-6">
        {/* Profile Pic Upload */}
        <div className="flex flex-col items-center justify-center gap-2 mb-2">
          <span
            className="text-xs font-semibold text-[#0B1E3F] hover:underline cursor-pointer font-dm-san-regular"
            onClick={handleProfilePicClick}
          >
            Add Profile Picture
          </span>
          <button
            type="button"
            disabled={isUploadingProfilePic}
            onClick={handleProfilePicClick}
            className="size-16 rounded-full border border-zinc-200 flex items-center justify-center bg-secondary-light hover:bg-zinc-100/50 cursor-pointer overflow-hidden group transition-all"
          >
            {isUploadingProfilePic ? (
              <IconLoader2 className="size-6 text-zinc-400 animate-spin" />
            ) : profilePicPreview ? (
              <img src={profilePicPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <IconCamera className="size-6 text-zinc-400 group-hover:text-zinc-500 transition-colors" />
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <form onSubmit={onFormSubmit} className="space-y-6">

          {/* Form Fields Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">

            {/* First Name */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                First Name
              </FieldLabel>
              <Input
                type="text"
                placeholder="First Name"
                {...registerField("first_name")}
                onFocus={() => handleFocus("first_name")}
                onBlur={() => handleBlur("first_name")}
                className={getInputClassName("first_name")}
              />
              <FieldError errors={[errors.first_name]} />
            </Field>

            {/* Last Name */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Last Name
              </FieldLabel>
              <Input
                type="text"
                placeholder="Last Name"
                {...registerField("last_name")}
                onFocus={() => handleFocus("last_name")}
                onBlur={() => handleBlur("last_name")}
                className={getInputClassName("last_name")}
              />
              <FieldError errors={[errors.last_name]} />
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Email
              </FieldLabel>
              <Input
                type="email"
                placeholder="Email Address"
                {...registerField("email")}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                className={getInputClassName("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            {/* Phone Number */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Phone Number
              </FieldLabel>
              <Input
                type="tel"
                placeholder="Phone Number"
                {...registerField("phone")}
                onFocus={() => handleFocus("phone")}
                onBlur={() => handleBlur("phone")}
                className={getInputClassName("phone")}
              />
              <FieldError errors={[errors.phone]} />
            </Field>

            {/* Address */}
            <Field className="sm:col-span-2">
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Address
              </FieldLabel>
              <Input
                type="text"
                placeholder="Address"
                {...registerField("address")}
                onFocus={() => handleFocus("address")}
                onBlur={() => handleBlur("address")}
                className={getInputClassName("address")}
              />
              <FieldError errors={[errors.address]} />
            </Field>

            {/* Country */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Country
              </FieldLabel>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={cn("w-full h-12! px-3 py-2 rounded-[8px] border bg-secondary-light font-dm-san-regular text-sm text-body-text focus:ring-0 focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden shadow-none", errors.country ? "border-error" : "border-zinc-200")}>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.isoCode} className="font-dm-san-regular font-normal text-sm" value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.country]} />
            </Field>

            {/* State */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-body-text font-dm-san-regular block">
                State
              </FieldLabel>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={states.length === 0}>
                    <SelectTrigger className={cn("w-full px-3 h-12! rounded-[8px] border bg-secondary-light font-dm-san-regular text-sm text-body-text focus:ring-0 focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden shadow-none", errors.state ? "border-error" : "border-zinc-200")}>
                      <SelectValue placeholder={states.length === 0 ? "Select a country first" : "Select State"} />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.isoCode} className="font-dm-san-regular font-normal text-sm" value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.state]} />
            </Field>

            {/* Gender */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Gender
              </FieldLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger size="default" className={cn("w-full h-12! px-3 py-3 rounded-[8px] border bg-secondary-light font-dm-san-regular text-sm text-body-text focus:ring-0 focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden shadow-none", errors.gender ? "border-error" : "border-zinc-200")}>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="font-dm-san-regular font-normal text-sm" value="MALE">Male</SelectItem>
                      <SelectItem className="font-dm-san-regular font-normal text-sm" value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.gender]} />
            </Field>

            {/* Date of Birth (DatePicker using Calendar & Popover) */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                Date of Birth
              </FieldLabel>
              <Controller
                name="date_of_birth"
                control={control}
                render={({ field }) => {
                  const selectedDate = field.value ? new Date(field.value) : undefined
                  return (
                    <Popover>
                      <PopoverTrigger
                        className={cn(
                          "w-full h-12! px-3 rounded-[8px] border text-left font-normal bg-secondary-light flex items-center justify-between text-body-text shadow-none hover:bg-secondary-light font-dm-san-regular text-sm cursor-pointer focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden",
                          errors.date_of_birth ? "border-error" : "border-zinc-200"
                        )}
                      >
                        <span>
                          {field.value
                            ? new Date(field.value).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                            : "Pick a date"}
                        </span>
                        <IconCalendar className="size-4 text-zinc-500" />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50 bg-white border border-zinc-200 shadow-lg rounded-lg" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={selectedDate}
                          startMonth={new Date(1930, 0)}
                          endMonth={new Date()}
                          onSelect={(date) => {
                            if (date) {
                              const year = date.getFullYear()
                              const month = String(date.getMonth() + 1).padStart(2, "0")
                              const day = String(date.getDate()).padStart(2, "0")
                              field.onChange(`${year}-${month}-${day}`)
                            } else {
                              field.onChange("")
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )
                }}
              />
              <FieldError errors={[errors.date_of_birth]} />
            </Field>

          </div>

          {/* Certificate Section (Caregiver only) */}
          {type === "CARE_GIVER" && (
            <div className="space-y-3 pt-2 border-t border-zinc-100">
              <Field>
                <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                  Certifications / Documents
                </FieldLabel>

                {/* Uploaded Certificates List */}
                {certificates.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {certificates.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-zinc-200 rounded-[8px] p-3 bg-secondary-light shadow-none"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-zinc-100 rounded-lg shrink-0">
                            <IconFileText className="size-5 text-zinc-500" />
                          </div>
                          <div className="truncate">
                            <span className="font-semibold text-sm text-body-text block truncate">
                              {cert.name}
                            </span>
                            {cert.size ? (
                              <span className="text-xs text-zinc-400">
                                {(cert.size / 1024).toFixed(1)} KB
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCert(index)}
                          className="p-1 hover:bg-zinc-200/60 rounded-full transition-colors text-zinc-500 hover:text-red-500 cursor-pointer outline-hidden shrink-0 ml-2"
                          title="Remove certificate"
                        >
                          <IconX className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Upload box */}
                {isUploadingCert ? (
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center border-2 border-dashed rounded-[8px] p-6 bg-secondary-color/5 text-center font-dm-san-regular border-secondary-color pointer-events-none"
                    )}
                  >
                    <IconLoader2 className="size-6 mb-2 text-secondary-color animate-spin" />
                    <span className="font-bold text-sm block text-[#0B1E3F]">
                      Uploading Certificate(s)...
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={handleCertClick}
                    className={cn(
                      "flex flex-col items-center justify-center border-2 border-dashed rounded-[8px] p-6 bg-secondary-color/5 cursor-pointer hover:bg-secondary-color/10 transition-colors text-center font-dm-san-regular",
                      errors.certification && certificates.length === 0 ? "border-red-500 bg-red-50/10" : "border-secondary-color"
                    )}
                  >
                    <IconUpload className={cn("size-6 mb-2", errors.certification && certificates.length === 0 ? "text-red-500" : "text-secondary-color")} />
                    <span className={cn("font-bold text-sm block", errors.certification && certificates.length === 0 ? "text-red-500" : "text-[#0B1E3F]")}>
                      {certificates.length > 0 ? "+ Upload More Certificates" : "+ Upload Your Certificate(s)"}
                    </span>
                    <span className="text-xs text-zinc-500 font-normal mt-1 block">
                      Accepted file types: PDF, DOCX, DOC, JPG, PNG
                    </span>
                  </div>
                )}
                <FieldError errors={[errors.certification]} />

                <input
                  type="file"
                  ref={certInputRef}
                  onChange={handleCertChange}
                  accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                  multiple
                  className="hidden"
                />
              </Field>
            </div>
          )}

          {/* Complete Profile Button */}
          <Button
            type="submit"
            disabled={!isValid || isPending || isUploadingProfilePic || isUploadingCert}
            className={`w-full h-12! rounded-full font-dm-san-regular font-semibold tracking-wide text-sm transition-all border-none outline-hidden cursor-pointer shadow-none flex items-center justify-center gap-2 ${isValid && !isPending && !isUploadingProfilePic && !isUploadingCert
              ? "bg-[#0B1E3F] hover:bg-[#1B335B] text-white"
              : "bg-primary-light text-body-text pointer-events-none"
              }`}
          >
            {isPending ? (
              <>
                <IconLoader2 className="size-4 animate-spin" />
                <span>Completing Profile...</span>
              </>
            ) : (
              <span>Complete Profile</span>
            )}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}

