import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchUsers, 
  fetchUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  CreateUserRequest,
  UpdateUserRequest
} from '@/api/userApi';
import { User } from '@/types/adminTypes';
import { ToastAction } from '@/components/ui/toast';

export function useUserManagement() {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isUserDetailsDialogOpen, setIsUserDetailsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users
  const { 
    data: users = [], 
    isLoading: isLoadingUsers,
    error: usersError
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  // Fetch a single user by ID
  const { 
    data: selectedUserData,
    isLoading: isLoadingUserDetails,
    error: userDetailsError
  } = useQuery({
    queryKey: ['user', selectedUserId],
    queryFn: () => selectedUserId ? fetchUserById(selectedUserId) : null,
    enabled: !!selectedUserId,
  });

  // Create user mutation
  const { mutate: createUserMutation, isPending: isCreatingUser } = useMutation({
    mutationFn: (userData: CreateUserRequest) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsAddUserDialogOpen(false);
      toast({
        title: "User created",
        description: "User has been successfully created",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create user: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update user mutation
  const { mutate: updateUserMutation, isPending: isUpdatingUser } = useMutation({
    mutationFn: (userData: UpdateUserRequest) => updateUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', selectedUserId] });
      setIsEditUserDialogOpen(false);
      toast({
        title: "User updated",
        description: "User has been successfully updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update user: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete/deactivate user mutation
  const { mutate: deactivateUserMutation } = useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User deactivated",
        description: "User has been successfully deactivated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to deactivate user: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Dialog control functions
  const openAddUserDialog = () => setIsAddUserDialogOpen(true);
  const closeAddUserDialog = () => setIsAddUserDialogOpen(false);
  
  const openEditUserDialog = (userId: number) => {
    setSelectedUserId(userId);
    setIsEditUserDialogOpen(true);
  };
  const closeEditUserDialog = () => setIsEditUserDialogOpen(false);
  
  const openUserDetailsDialog = (userId: number) => {
    setSelectedUserId(userId);
    setIsUserDetailsDialogOpen(true);
  };
  const closeUserDetailsDialog = () => setIsUserDetailsDialogOpen(false);

  const handleUserAction = (action: string, user: User) => {
    switch (action) {
      case 'view':
        openUserDetailsDialog(user.id);
        break;
      case 'edit':
        openEditUserDialog(user.id);
        break;
      case 'deactivate':
        toast({
          title: "Deactivate user",
          description: `Are you sure you want to deactivate ${user.name}?`,
          action: (
            <ToastAction altText="Confirm deactivation" onClick={() => deactivateUserMutation(user.id)}>
              Confirm
            </ToastAction>
          ),
        });
        break;
      case 'activate':
        // In a real implementation, this would call an API to reactivate the user
        // For now, we'll just show a success message
        toast({
          title: "Success",
          description: `${user.name} has been activated`,
        });
        // In a real implementation, we would invalidate the queries here
        queryClient.invalidateQueries({ queryKey: ['users'] });
        break;
      default:
        break;
    }
  };

  const getUserStatus = (user: User) => {
    if (user.status === 'active') return 'Active';
    if (user.status === 'inactive') return 'Inactive';
    return 'Unknown';
  };

  return {
    users,
    isLoadingUsers,
    usersError,
    selectedUserData,
    isLoadingUserDetails,
    userDetailsError,
    
    isAddUserDialogOpen,
    isEditUserDialogOpen,
    isUserDetailsDialogOpen,
    
    openAddUserDialog,
    closeAddUserDialog,
    openEditUserDialog,
    closeEditUserDialog,
    openUserDetailsDialog,
    closeUserDetailsDialog,
    
    handleUserAction,
    createUser: createUserMutation,
    updateUser: updateUserMutation,
    deactivateUser: deactivateUserMutation,
    
    isCreatingUser,
    isUpdatingUser,
    selectedUserId,
    getUserStatus,
  };
}
