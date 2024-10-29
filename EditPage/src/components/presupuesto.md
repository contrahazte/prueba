  <h3>Nombre del Presupuesto:</h3>
          <p>{nombrePresupuesto}</p>
          <h3>Descripción del Presupuesto:</h3>
          <p>{descripcionPresupuesto}</p>

          <h3>Contenido del Presupuesto:</h3>
          {contenidoPresupuesto.length > 0 ? (
            contenidoPresupuesto.map((detalle, index) => (
              <div key={index} className='detalle-presupuesto'>
                <p>
                  <strong>Servicio:</strong> {detalle.servicio}
                </p>
                <p>
                  <strong>Ciclo:</strong> {detalle.ciclo}
                </p>
                <p>
                  <strong>Precio:</strong> {detalle.precio}
                </p>
                <p>
                  <strong>Total:</strong> {detalle.total}
                </p>
              </div>
            ))
          ) : (
            <p>No hay contenido en el presupuesto.</p>
          )}