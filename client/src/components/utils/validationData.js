  const selectOptions ={    
    rol: [
    { value: "Usuario", label: "Usuario" },
    { value: "Supervisor", label: "Supervisor" },
    { value: "Administrador", label: "Administrador" },
    ],
  
    activo:[
      { value: "Select", label: "Seleccionar" },
      { value: "1", label: "Activo" },
      { value: "0", label: "Inactivo" },
  ],
  
  estado: [
    { value: "Select", label: "Seleccionar" },
    { value: "1", label: "Habilitado" },
    { value: "0", label: "Deshabilitado" },
  ],
  
  acceso: [
    { value: "Select", label: "Seleccionar" },
    { value: "1", label: "Administrador" },
    { value: "2", label: "Supervisor" },
    { value: "3", label: "Estandar" },
  ]
  };

  const rolePermissions = {
    Administrador: ["fech_reg", "fech_auth", "usuario_id"],
    Supervisor: ["fech_reg", "fech_auth", "usuario_id"],
    Usuario: ["identificacion", "rol", "nombre", "correo", "estado", "acceso", "Activo", "usuario_id"]
  }
  
  const selectFields = ["activo", "estado", "rol", "acceso"];
  
  const renamedLabels = {
      activo: "Estado",
      fech_reg: "Fecha Registro",
      fech_auth: "Fecha Autorización",
      direcc: "Dirección",
  }

  module.exports = {
    selectOptions,
    rolePermissions,
    selectFields,
    renamedLabels}