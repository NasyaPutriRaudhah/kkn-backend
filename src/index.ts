import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (!publicRole) return;

    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
      where: { action: 'api::produk-hukum.produk-hukum.find', role: publicRole.id },
    });

    if (existing) return;

    await strapi.db.query('plugin::users-permissions.permission').create({
      data: { action: 'api::produk-hukum.produk-hukum.find', role: publicRole.id },
    });
    await strapi.db.query('plugin::users-permissions.permission').create({
      data: { action: 'api::produk-hukum.produk-hukum.findOne', role: publicRole.id },
    });
  },
};
