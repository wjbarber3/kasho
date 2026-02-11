<template>
  <Toast position="bottom-center" />
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-y-4">
    <div class="grid grid-cols-2">
      <div class="w-full">contact</div>
      <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
        <div class="grid grid-cols-3 w-full gap-x-3">
            <div>
              <InputText name="username" type="text" placeholder="Username" fluid />
              <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{ $form.username.error?.message }}</Message>
            </div>
            <div>
              <InputText name="username" type="text" placeholder="Username" fluid />
              <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{ $form.username.error?.message }}</Message>
            </div>
            <div>
              <InputText name="username" type="text" placeholder="Username" fluid />
              <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{ $form.username.error?.message }}</Message>
            </div>
        </div>
        <Button type="submit" label="Submit" />
      </Form>
    </div>
  </div>
</template>

<script setup>

import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast';

const toast = useToast()

const resolver = ({ values }) => {
    const errors = {};

    if (!values.username) {
        errors.username = [{ message: 'Username is required.' }];
    }

    return {
        values,
        errors
    };
};

const onFormSubmit = ({ valid }) => {
    if (valid) {
      console.log('toast')
        toast.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'I look forward to getting in touch.',
            life: 3000
        });
    }
};

</script>