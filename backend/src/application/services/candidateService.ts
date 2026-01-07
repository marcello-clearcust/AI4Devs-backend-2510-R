import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { PrismaClient } from '@prisma/client';

export const addCandidate = async (candidateData: any, prisma: PrismaClient) => {
    try {
        validateCandidateData(candidateData); // Validar los datos del candidato
    } catch (error: any) {
        throw new Error(error);
    }

    const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
    try {
        const savedCandidate = await candidate.save(prisma); // Guardar el candidato en la base de datos
        const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

        // Guardar la educación del candidato
        if (candidateData.educations) {
            for (const education of candidateData.educations) {
                const educationModel = new Education(education);
                educationModel.candidateId = candidateId;
                await educationModel.save(prisma);
                candidate.education.push(educationModel);
            }
        }

        // Guardar la experiencia laboral del candidato
        if (candidateData.workExperiences) {
            for (const experience of candidateData.workExperiences) {
                const experienceModel = new WorkExperience(experience);
                experienceModel.candidateId = candidateId;
                await experienceModel.save(prisma);
                candidate.workExperience.push(experienceModel);
            }
        }

        // Guardar los archivos de CV
        if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
            const resumeModel = new Resume(candidateData.cv);
            resumeModel.candidateId = candidateId;
            await resumeModel.save(prisma);
            candidate.resumes.push(resumeModel);
        }
        return savedCandidate;
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('The email already exists in the database');
        } else {
            throw error;
        }
    }
};

export const findCandidateById = async (id: number, prisma: PrismaClient): Promise<Candidate | null> => {
    try {
        const candidate = await Candidate.findOne(id, prisma); // Cambio aquí: pasar directamente el id
        return candidate;
    } catch (error) {
        console.error('Error al buscar el candidato:', error);
        throw new Error('Error al recuperar el candidato');
    }
};

export const updateCandidateStage = async (
    candidateId: number,
    applicationId: number,
    stageId: number,
    prisma: PrismaClient
) => {
    // 1. Validate candidate exists
    const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
    });

    if (!candidate) {
        throw new Error('Candidate not found');
    }

    // 2. Validate application exists and belongs to candidate
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
            position: {
                include: {
                    interviewFlow: {
                        include: {
                            interviewSteps: true,
                        },
                    },
                },
            },
        },
    });

    if (!application) {
        throw new Error('Application not found');
    }

    if (application.candidateId !== candidateId) {
        throw new Error('Application does not belong to the specified candidate');
    }

    // 3. Validate interview step exists
    const interviewStep = await prisma.interviewStep.findUnique({
        where: { id: stageId },
    });

    if (!interviewStep) {
        throw new Error('Interview step not found');
    }

    // 4. Validate interview step belongs to position's interview flow
    const positionInterviewFlowId = application.position.interviewFlowId;
    const isValidStep = application.position.interviewFlow.interviewSteps.some(
        (step) => step.id === stageId
    );

    if (!isValidStep) {
        throw new Error('Interview step is not valid for the position\'s interview flow');
    }

    // 5. Update application's currentInterviewStep
    const updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: {
            currentInterviewStep: stageId,
        },
        include: {
            position: {
                select: {
                    id: true,
                    title: true,
                },
            },
            interviewStep: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return updatedApplication;
};
