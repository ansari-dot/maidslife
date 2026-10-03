export const getPaginationOptions = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const rawLimit = parseInt(query.limit, 10) || 20;
  const limit = Math.min(100, Math.max(1, rawLimit));
  const skip = (page - 1) * limit;

  let sort = { createdAt: -1 };
  if (query.sort) {
    if (query.sort.startsWith('-')) {
      sort = { [query.sort.substring(1)]: -1 };
    } else {
      sort = { [query.sort]: 1 };
    }
  }

  return { page, limit, skip, sort };
};

export const getPaginationMeta = (total, page, limit) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};
