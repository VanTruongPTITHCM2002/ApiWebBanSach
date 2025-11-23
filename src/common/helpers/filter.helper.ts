import { SelectQueryBuilder } from 'typeorm';

export function applyFilter<T>(
  qb: SelectQueryBuilder<T>,
  filter: any,
  alias = 't',
) {
  if (!filter) return;

  const { and, or } = filter;

  if (and) {
    and.forEach((f) => {
      Object.keys(f).forEach((k) => {
        const condition = f[k];
        const field = k.includes('.')
          ? k.split('.').join('_')
          : `${alias}.${k}`;
        if (condition.eq !== undefined)
          qb.andWhere(`${field} = :${field}`, { [field]: condition.eq });
        if (condition.gte !== undefined)
          qb.andWhere(`${field} >= :${field}`, { [field]: condition.gte });
        if (condition.lte !== undefined)
          qb.andWhere(`${field} <= :${field}`, { [field]: condition.lte });
        if (condition.like !== undefined)
          qb.andWhere(`${field} LIKE :${field}`, { [field]: condition.like });
      });
    });
  }

  if (or) {
    const orExpr = or
      .map((f) =>
        Object.keys(f)
          .map((k) => {
            const condition = f[k];
            const field = k.includes('.')
              ? k.split('.').join('_')
              : `${alias}.${k}`;
            if (condition.eq !== undefined)
              return `${field} = '${condition.eq}'`;
            if (condition.gte !== undefined)
              return `${field} >= ${condition.gte}`;
            if (condition.lte !== undefined)
              return `${field} <= ${condition.lte}`;
            if (condition.like !== undefined)
              return `${field} LIKE '${condition.like}'`;
          })
          .join(' AND '),
      )
      .join(' OR ');
    if (orExpr) qb.andWhere(`(${orExpr})`);
  }
}

export function applySort<T>(qb: SelectQueryBuilder<T>, sort?: string[]) {
  if (!sort) return;
  const alias = qb.alias; // lấy alias hiện tại của query builder
  sort.forEach((s) => {
    const [field, order] = s.split(',');
    qb.addOrderBy(
      `${alias}.${field}`,
      (order || 'ASC').toUpperCase() as 'ASC' | 'DESC',
    );
  });
}
