<template>
  <Toast position="bottom-center" />
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-y-4">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold">Let's chat.</h1>
      <p class="max-w-[80%] mx-auto md:max-w-2xl mt-2">
        I work at the intersection of product thinking and high-quality frontend execution.
If that’s where you’re headed, I'd love to talk.
      </p>
    </div>
    <div class="grid grid-cols-12 gap-x-4 rounded-2xl bg-white p-4">
      <div class="w-full p-10 col-span-12 md:col-span-5 bg-blue-400 rounded-2xl md:h-96 relative overflow-hidden text-white">
        <h1 class="font-bold text-2xl">Contact Info:</h1>
        <p class="text-xs">Drop me a line.</p>
        <div class="flex flex-col gap-y-4 mt-6 font-medium relative z-10">
          <div class="flex items-center gap-x-3">
            <i class="pi pi-phone" />
            <p>864.720.9494</p>
          </div>
          <div class="flex items-center gap-x-3">
            <i class="pi pi-envelope" />
            <p>wjbarber3@gmail.com</p>
          </div>
          <div class="flex items-center gap-x-3">
            <i class="pi pi-map-marker" />
            <p>Denver, CO</p>
          </div>
        </div>
        <div class="z-0 rounded-full bg-linear-to-r from-blue-400 to-blue-100 w-72 h-72 absolute -bottom-36 -right-24"></div>
      </div>
      <Form
        v-slot="$form" :initialValues
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col gap-4 w-full col-span-12 md:col-span-7 md:p-4 mt-8 md:mt-0"
      >
        <div class="grid grid-cols-2 w-full gap-4">
            <div class="col-span-2">
              <InputText name="fullName" type="text" placeholder="Full Name" fluid />
              <Message v-if="$form.fullName?.invalid" severity="error" size="small" variant="simple">{{ $form.fullName?.error?.message }}</Message>
            </div>
            <div>
              <InputText
                name="phone"
                type="tel"
                autocomplete="tel"
                placeholder="Phone"
                fluid
              />
              <Message v-if="$form.phone?.invalid" severity="error" size="small" variant="simple">{{ $form.phone.error?.message }}</Message>
            </div>
            <div>
              <InputText
                name="email"
                type="email"
                autocomplete="email"
                placeholder="Email"
                fluid
              />
              <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error?.message }}</Message>
            </div>
            <div class="col-span-2">
              <InputText name="subject" type="text" placeholder="Subject" fluid />
              <Message v-if="$form.subject?.invalid" severity="error" size="small" variant="simple">{{ $form.subject.error?.message }}</Message>
            </div>
            <div class="col-span-2">
              <Textarea name="message" type="text" placeholder="Message" fluid class="h-20" />
              <Message v-if="$form.message?.invalid" severity="error" size="small" variant="simple">{{ $form.message.error?.message }}</Message>
            </div>
        </div>
        <Button type="submit" class="bg-amber-300! text-slate-700! border-amber-300! font-medium">
          <template v-if="!isFormSubmitting">
            <span class="font-medium">Submit</span>
            <i class="pi pi-arrow-right text-slate-600"></i>
          </template>
          <template v-else>
            <i class="pi pi-spinner text-slate-500 animate-spin"></i>
          </template>
        </Button>
      </Form>
    </div>
  </div>
</template>

<script setup>

import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import Textarea from 'primevue/textarea'

const toast = useToast()
const isFormSubmitting = ref(false)



const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const phoneRegex =
  /^\+?[1-9]\d{9,14}$/; // International-safe (E.164 style)

const resolver = ({ values }) => {
  const errors = {};

  const trimmed = {
    fullName: values.fullName?.trim(),
    phone: values.phone?.trim(),
    email: values.email?.trim(),
    subject: values.subject?.trim(),
    message: values.message?.trim()
  };

  // Full Name
  if (!trimmed.fullName) {
    errors.fullName = [{ message: 'Full name is required.' }];
  } else if (trimmed.fullName.length < 2) {
    errors.fullName = [{ message: 'Name must be at least 2 characters.' }];
  }

  // Email
  if (!trimmed.email) {
    errors.email = [{ message: 'Email is required.' }];
  } else if (!emailRegex.test(trimmed.email)) {
    errors.email = [{ message: 'Please enter a valid email address.' }];
  }

  // Phone
  if (!trimmed.phone) {
    errors.phone = [{ message: 'Phone number is required.' }];
  } else if (!phoneRegex.test(trimmed.phone)) {
    errors.phone = [{ message: 'Enter a valid phone number.' }];
  }

  // Subject
  if (!trimmed.subject) {
    errors.subject = [{ message: 'Subject is required.' }];
  } else if (trimmed.subject.length < 3) {
    errors.subject = [{ message: 'Subject is too short.' }];
  }

  // Message
  if (!trimmed.message) {
    errors.message = [{ message: 'Message is required.' }];
  } else if (trimmed.message.length < 10) {
    errors.message = [{ message: 'Message should be at least 10 characters.' }];
  }

  return {
    values: trimmed,
    errors
  };
};

const onFormSubmit = async ({ valid, values, reset }) => {
  if (!valid) return;

  try {
    isFormSubmitting.value = true

    const response = await fetch("https://formspree.io/f/xkovrpko", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(values)
    });

    const result = await response.json();

    if (response.ok) {
      toast.add({
        severity: "success",
        summary: "Message Sent",
        detail: "Thanks! I'll get back to you soon.",
        life: 3000
      });

      reset(); // resets PrimeVue form
    } else {
      throw new Error(result?.errors?.[0]?.message || "Submission failed.");
    }

  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message || "Something went wrong.",
      life: 3000
    })
  } finally {
    isFormSubmitting.value = false
  }
};

</script>

<style>

.p-inputtext.p-invalid {
  color: rgb(248, 113, 113);
}

</style>