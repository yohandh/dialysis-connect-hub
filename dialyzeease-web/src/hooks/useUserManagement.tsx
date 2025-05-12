import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchUsers, 
  fetchUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  deactivateUser,
  activateUser,
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
    error: userDetailsError,
    refetch: refetchUserDetails
  } = useQuery({
    queryKey: ['user', selectedUserId],
    queryFn: () => selectedUserId ? fetchUserById(selectedUserId) : null,
    enabled: !!selectedUserId,
  });

  // Log selected user data for debugging
  useEffect(() => {
    if (selectedUserData) {
      console.log("Selected user data for editing:", selectedUserData);
    }
  }, [selectedUserData]);

  // Create user mutation
  const { mutate: createUserMutation, isPending: isCreatingUser, error: createUserError } = useMutation({
    mutationFn: (userData: CreateUserRequest) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsAddUserDialogOpen(false);
      toast({
        title: "User created",
        description: "User has been successfully created",
      });
    },
    onError: (error: any) => {
      // Only show toast for errors that aren't handled in the form
      if (error.message !== "Email already in use") {
        toast({
          title: "Error",
          description: `Failed to create user: ${error.message}`,
          variant: "error",
        });
      }
      // Error will be returned to the component for form-level handling
    }
  });

  // Update user mutation
  const { mutate: updateUserMutation, isPending: isUpdatingUser, error: updateUserError } = useMutation({
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
    onError: (error: any) => {
      // Only show toast for errors that aren't handled in the form
      if (error.message !== "Email already in use") {
        toast({
          title: "Error",
          description: `Failed to update user: ${error.message}`,
          variant: "error",
        });
      }
      // Error will be returned to the component for form-level handling
    }
  });

  // Delete user mutation
  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User deleted",
        description: "User has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "error",
      });
    }
  });

  // Deactivate user mutation
  const { mutate: deactivateUserMutation } = useMutation({
    mutationFn: (userId: number) => deactivateUser(userId),
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
        variant: "error",
      });
    }
  });

  // Activate user mutation
  const { mutate: activateUserMutation } = useMutation({
    mutationFn: (userId: number) => activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User activated",
        description: "User has been successfully activated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to activate user: ${error.message}`,
        variant: "error",
      });
    }
  });

  // Dialog control functions
  const openAddUserDialog = () => setIsAddUserDialogOpen(true);
  const closeAddUserDialog = () => setIsAddUserDialogOpen(false);
  
  const openEditUserDialog = (userId: number) => {
    console.log("Opening edit dialog for user ID:", userId);
    setSelectedUserId(userId);
    // Force refetch user data when opening edit dialog
    queryClient.invalidateQueries({ queryKey: ['user', userId] });
    setTimeout(() => {
      refetchUserDetails().then(() => {
        console.log("User data fetched, opening dialog");
        setIsEditUserDialogOpen(true);
      }).catch(error => {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "error",
        });
      });
    }, 100);
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
          variant: "warning",
          action: (
            <ToastAction altText="Confirm deactivation" onClick={() => deactivateUserMutation(user.id)}>
              Confirm
            </ToastAction>
          ),
        });
        break;
      case 'activate':
        toast({
          title: "Activate user",
          description: `Are you sure you want to activate ${user.name}?`,
          variant: "success",
          action: (
            <ToastAction altText="Confirm activation" onClick={() => activateUserMutation(user.id)}>
              Confirm
            </ToastAction>
          ),
        });
        break;
      case 'delete':
        toast({
          title: "Delete user",
          description: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
          variant: "error",
          action: (
            <ToastAction altText="Confirm deletion" onClick={() => deleteUserMutation(user.id)}>
              Confirm
            </ToastAction>
          ),
        });
        break;
      default:
        break;
    }
  };

  const getUserStatus = (user: User) => {
    if (user.status?.toLowerCase() === 'active') return 'Active';
    if (user.status?.toLowerCase() === 'inactive') return 'Inactive';
    return 'Unknown';
  };

  const handleCreateUser = async (userData: CreateUserRequest) => {
    return new Promise<void>((resolve, reject) => {
      createUserMutation(userData, {
        onSuccess: () => resolve(),
        onError: (error: any) => reject(error)
      });
    });
  };

  const handleUpdateUser = async (userData: UpdateUserRequest) => {
    console.log("Handling update user with data:", userData);
    return new Promise<void>((resolve, reject) => {
      updateUserMutation(userData, {
        onSuccess: () => {
          console.log("User updated successfully");
          // Invalidate both the users list and the specific user data
          queryClient.invalidateQueries({ queryKey: ['users'] });
          queryClient.invalidateQueries({ queryKey: ['user', userData.id] });
          resolve();
        },
        onError: (error: any) => {
          console.error("Error updating user:", error);
          reject(error);
        }
      });
    });
  };

  return {
    users,
    isLoadingUsers,
    usersError,
    selectedUserData,
    isLoadingUserDetails,
    userDetailsError,
    createUserError,
    updateUserError,
    isAddUserDialogOpen,
    isEditUserDialogOpen,
    isUserDetailsDialogOpen,
    isCreatingUser,
    isUpdatingUser,
    openAddUserDialog,
    closeAddUserDialog,
    openEditUserDialog,
    closeEditUserDialog,
    openUserDetailsDialog,
    closeUserDetailsDialog,
    handleUserAction,
    createUserMutation: handleCreateUser,
    updateUserMutation: handleUpdateUser,
    deleteUserMutation,
    deactivateUserMutation,
    activateUserMutation,
    selectedUserId,
    getUserStatus,
  };
}
