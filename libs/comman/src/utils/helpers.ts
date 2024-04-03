import fs from 'fs';
import { Request } from 'express';

export const filterObjectKeys = <T extends Record<string, unknown>>(
  fieldsArray: string[],
  objectArray: T[],
): Partial<T>[] => {
  const filteredArray = objectArray.map((originalObj) => {
    const obj: Partial<T> = {};
    let found = false;
    Object.keys(originalObj).forEach((key) => {
      if (fieldsArray.includes(key)) {
        obj[key as keyof T] = originalObj[key as keyof T];
        found = true;
      }
    });
    return obj;
  });
  return filteredArray;
};

export const getPaginatedPayload = <T extends object>(
  dataArray: T[],
  page: number,
  limit: number,
): {
  previousPage: string | null;
  currentPage: string;
  nextPage: string | null;
  data: T[];
} => {
  const startPosition = +(page - 1) * limit;

  const totalItems = dataArray.length;
  const totalPages = Math.ceil(totalItems / limit);

  dataArray = dataArray.slice(startPosition, startPosition + limit);

  const payload = {
    page,
    limit,
    totalPages,
    previousPage: page > 1 ? 'Previous Page' : null,
    nextPage: page < totalPages ? 'Next Page' : null,
    totalItems,
    currentPageItems: dataArray.length,
    data: dataArray,
    currentPage: `Page ${page}`,
  };
  return payload;
};

/**
 * @param {Request} req
 * @param {string} fileName
 * @returns {string}
 */
export const getStaticFilePath = (req: Request, fileName: string): string => {
  return `${req.protocol}://${req.get('host')}/images/${fileName}`;
};

/**
 * @param {string} fileName
 * @returns {string}
 */
export const getLocalPath = (fileName: string): string => {
  return `public/images/${fileName}`;
};

/**
 * @param {string} localPath
 */
export const removeLocalFile = (localPath: string): void => {
  fs.unlink(localPath, (err) => {
    if (err) console.log('Error while removing local files: ', err);
    else {
      console.log('Removed local: ', localPath);
    }
  });
};

/**
 * @param {Request} req
 */
// export const removeUnusedMulterImageFilesOnError = (req: Request): void => {
//   try {
//     const multerFile = req.file;
//     const multerFiles = req.files;
//
//     if (multerFile) {
//       removeLocalFile(multerFile.path);
//     }
//
//     if (multerFiles) {
//       const filesValueArray = Object.values(multerFiles);
//       filesValueArray.map((fileFields) => {
//         fileFields.map((fileObject) => {
//           removeLocalFile(fileObject.path);
//         });
//       });
//     }
//   } catch (error) {
//     console.log('Error while removing image files: ', error);
//   }
// };

/**
 * @param {{ page: number; limit: number; customLabels: mongoose.CustomLabels; }} options
 * @returns {mongoose.PaginateOptions}
 */
// export const getMongoosePaginationOptions = ({
//   page = 1,
//   limit = 10,
//   customLabels,
// }: {
//   page: number;
//   limit: number;
//   customLabels: mongoose.CustomLabels;
// }): mongoose.PaginateOptions => {
//   return {
//     page: Math.max(page, 1),
//     limit: Math.max(limit, 1),
//     pagination: true,
//     customLabels: {
//       pagingCounter: 'serialNumberStartFrom',
//       ...customLabels,
//     },
//   };
// };

/**
 * @param {number} max
 * @returns {number}
 */
export const getRandomNumber = (max: number): number => {
  return Math.floor(Math.random() * max);
};
