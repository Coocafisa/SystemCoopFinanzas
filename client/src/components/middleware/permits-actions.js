const getRolePermissions = (rol) => {
    if (!rol) return { canEdit: true, canDelete: true, canCheck: true, canAddRegister: true };    
    const roles = typeof rol === "string" ? rol.split(',') : ["None"];
  
    const permissions = {
      Administrador: {
        canEdit: true,
        canDelete: true,
        canCheck: true,
        canAddRegister: true,
      },
      Supervisor: {
        canEdit: true,
        canDelete: false,
        canCheck: false,
        canAddRegister: true
      },
      Estandar: {
        canEdit: false,
        canDelete: false,
        canCheck: false,
        canAddRegister: false,
      },
      None: {
        canEdit: false,
        canDelete: false,
        canCheck: false,
        canAddRegister: false,
      },
    };
  
    return {
      canEdit: roles.some(r => permissions[r]?.canEdit),
      canDelete: roles.some(r => permissions[r]?.canDelete),
      canCheck: roles.some(r => permissions[r]?.canCheck),
      canAddRegister: roles.some(r => permissions[r]?.canAddRegister),
    };
};
  
export default getRolePermissions;
