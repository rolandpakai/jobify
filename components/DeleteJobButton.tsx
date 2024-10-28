import { Button } from './ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJobAction } from '@/utils/actions';
import { useToast } from '@/hooks/use-toast';

const DeleteJobButton = async ({id}: {id: string}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteJobAction(id),
    onSuccess: (data) => {
      if (!data) {
        toast({ description: "There was an error" });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });

      toast({ description: "Job deleted."});
    }
  });
  
  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() => mutate(id)}
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
};

export default DeleteJobButton;