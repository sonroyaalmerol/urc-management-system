import type {
  PrismaModel,
  PrismaBody
} from '../../types/client-prisma'

import { useToast } from '@chakra-ui/react'

export const usePrisma = (model: PrismaModel) => {
  const toast = useToast()

  const fetchPrisma = async (args: PrismaBody) => {
    const response = await fetch('/api/prisma', {
      method: "POST",
      body: JSON.stringify(args),
    })

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const error = (data && data.error) || response.status
      
      toast({ title: 'Error', description: error, status: 'error' })
    }

    return data
  }
  return {
    aggregate: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'aggregate',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    count: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'count',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    create: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'create',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    createMany: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'createMany',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    delete: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'delete',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    deleteMany: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'deleteMany',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    findFirst: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'findFirst',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    findMany: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'findMany',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    findUnique: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'findUnique',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    groupBy: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'groupBy',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    update: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'update',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    updateMany: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'updateMany',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    }),
    upsert: (args?) => new Promise((resolve, reject) => {
      fetchPrisma({
        action: 'upsert',
        model,
        args
      }).then((res) => resolve(res)).catch((err) => reject(err))
    })
  }
};
