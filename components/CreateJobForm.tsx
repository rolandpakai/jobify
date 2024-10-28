"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { JobStatus, JobMode, createAndEditJobSchema, CreateAndEditJobType } from "@/utils/types";
import { CustomFormField, CustomFormSelect } from './FormComponents';
import { createJobAction } from '@/utils/actions';

const CreateJobForm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const { mutate, isPending} = useMutation({
    mutationFn: (values: CreateAndEditJobType) => createJobAction(values),
    onSuccess: (data) => {
      if (!data) {
        toast({ description: "There was an error"});
      }

      toast({ description: "Job created successfully" });
      queryClient.invalidateQueries({ queryKey: ["jobs"]});
      queryClient.invalidateQueries({ queryKey: ["stats"]});
      queryClient.invalidateQueries({ queryKey: ["charts"]});
    
      router.push('/jobs');
    }
  });
  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: '',
      company: '',
      location: '',
      status: JobStatus.Pending,
      mode: JobMode.FullTime,
    },
  });

  const onSubmit = (values: CreateAndEditJobType) => {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='bg-muted p-8 rounded'>
        <h2 className="capitalize font-semibold text-4xl mb-6">
          Add Job
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          <CustomFormField name='position' control={form.control} />
          <CustomFormField name='company' control={form.control} />
          <CustomFormField name='location' control={form.control} />
          <CustomFormSelect
            name='status'
            control={form.control}
            labelText='job status'
            items={Object.values(JobStatus)}
          />
          <CustomFormSelect
            name='mode'
            control={form.control}
            labelText='job mode'
            items={Object.values(JobMode)}
          />
          <Button
            type='submit'
            className='self-end capitalize'
            disabled={isPending}
          >
            {isPending ? 'Loading...' : 'create job'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateJobForm;