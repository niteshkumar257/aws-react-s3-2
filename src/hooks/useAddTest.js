import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';
import { ALL_TEST_DETAILS } from './useFetchSchoolTests';
import { adminConfig } from '../config';
import { GW_URL } from "../config";
import { ToastContainer, toast } from "react-toastify";

const useAddTest = () => {

    const queryClient = useQueryClient();

  const mutation = useMutation(
    async ({total_marks,test_id,classs,school_id}) => {
     
      const response = await axios.post(`${GW_URL}/schools/${school_id}/${classs}/updateTestTotalMarks`,
        {
          total_marks: total_marks,
          test_id: test_id,
        },
        adminConfig);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        // Destructure variables to get school_id
        const { school_id } = variables;
        queryClient.invalidateQueries([ALL_TEST_DETAILS, school_id]);
        toast.success("Test Added successfully",{
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      },
     
    }
  );

  const addTest = async ({total_marks,test_id,classs,school_id}) => {
 
    try {
      await mutation.mutateAsync({total_marks,test_id,classs,school_id});
    } catch (error) {
      // Handle error
      throw new Error(error.message)
      console.error('Error adding data to database:', error);
    }
  };

  return {
    addTest,
    isLoading: mutation.isLoading,
    isError: mutation.isError
  };
    
};

export default useAddTest;
