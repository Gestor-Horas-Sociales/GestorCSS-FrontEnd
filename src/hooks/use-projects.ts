import type {
    ProjectType,
    ProjectSchema
} from '../Types/ProyectType';
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject
} from '../api/projects';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { AxiosError } from 'axios';

export const useProjects = () => {
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeEdit, setActiveEdit] = useState(false);

    const handleDeleteProject = async (id: number) => {
        setLoading(true);
        try {
            const response = await deleteProject(String(id));
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error al eliminar el proyecto:", error);
            toast.error("Error al eliminar el proyecto");
        }
        finally {
            setLoading(false);
            getAllProjects();
        }
    };

    const insertProject = async (data: z.infer<typeof ProjectSchema>) => {
        setLoading(true);
        try {
            if (activeEdit) {
                const response = await updateProject(String(data.id), {
                    name: data.name,
                    description: data.description,
                    social_ipact: data.social_ipact ?? '',
                    type_hours_id: data.type_hours_id,
                    req_hours: data.req_hours,
                    maximun_students: data.maximun_students,
                    req_min_year: data.req_min_year,
                    req_gender: data.req_gender,
                    req_career: data.req_career,
                    number_beneficaries: data.number_beneficaries,
                    district_id: data.district_id,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    active: data.active,
                    institution_id: data.institution_id,
                });
                setActiveEdit(false);
                setOpen(false);
                toast.success(response.data.message);
            } else {
                const response = await createProject({
                    name: data.name,
                    description: data.description,
                    social_ipact: data.social_ipact ?? '',
                    type_hours_id: data.type_hours_id,
                    req_hours: data.req_hours,
                    maximun_students: data.maximun_students,
                    req_min_year: data.req_min_year,
                    req_gender: data.req_gender,
                    req_career: data.req_career,
                    number_beneficaries: data.number_beneficaries,
                    district_id: data.district_id,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    active: data.active,
                    institution_id: data.institution_id,
                });
                toast.success(response.data.message);
                setOpen(false);
            }
        } catch (error: unknown) {
            console.error("Error al crear el proyecto:", error);
            const err = error as AxiosError<{ message?: string }>;
            const message = err.response?.data?.message;
            toast.error(message || "Error al crear el proyecto");
        }
        finally {
            setLoading(false);
            getAllProjects();
        }
    }

    const getAllProjects = useCallback(async () => {
        setLoading(true);
       try {
        const data = await getProjects();
        setProjects(data);
       }catch (error){
        console.error("Error al cargar proyectos:", error);
       }finally{
        setLoading(false);
       }
    }, []);

    useEffect(() => {
        getAllProjects();
    }, [getAllProjects]);


    return {
        projects,
        loading,
        handleDeleteProject,
        open,
        setOpen,
        activeEdit,
        setActiveEdit,
        insertProject,
    }
};
